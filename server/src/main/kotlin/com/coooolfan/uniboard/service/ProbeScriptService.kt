package com.coooolfan.uniboard.service

import com.coooolfan.uniboard.model.SystemConfig
import com.coooolfan.uniboard.model.host
import com.coooolfan.uniboard.model.id
import org.babyfish.jimmer.sql.kt.KSqlClient
import org.babyfish.jimmer.sql.kt.ast.expression.eq
import org.springframework.stereotype.Service

@Service
class ProbeScriptService(private val sql: KSqlClient) {
    fun genCustomInstallScript(probeId: Long, key: String, interval: Int): String {
        val baseUrl = sql.createQuery(SystemConfig::class) {
            where(table.id eq 0L)
            select(table.host)
        }.fetchOne()
        val normalizedBaseUrl = baseUrl.removeSuffix("/")
        return generateInstallScript(normalizedBaseUrl, probeId, key, interval)
    }

    private fun generateInstallScript(host: String, probeId: Long, key: String, interval: Int): String {
        return """
#!/bin/bash
set -e

SERVICE_NAME="system-probe"
INSTALL_DIR="/opt/system-probe"
PROBE_HOST="$host"
PROBE_ID="$probeId"
PROBE_KEY="$key"
INTERVAL="$interval"

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${'$'}{BLUE}[INFO]${'$'}{NC} ${'$'}1"; }
log_success() { echo -e "${'$'}{GREEN}[OK]${'$'}{NC} ${'$'}1"; }
log_error() { echo -e "${'$'}{RED}[ERROR]${'$'}{NC} ${'$'}1" >&2; }

if [[ ${'$'}EUID -ne 0 ]]; then
  log_error "Must run as root"
  exit 1
fi

for cmd in curl systemctl; do
  if ! command -v ${'$'}cmd &> /dev/null; then
    log_error "Command '${'$'}cmd' not found"
    exit 1
  fi
done

log_info "Installing probe ID=${'$'}PROBE_ID, key=${'$'}PROBE_KEY, interval=${'$'}{INTERVAL}s"

if systemctl is-active --quiet ${'$'}SERVICE_NAME 2>/dev/null; then
  systemctl stop ${'$'}SERVICE_NAME
fi

mkdir -p ${'$'}INSTALL_DIR
cd ${'$'}INSTALL_DIR

curl -fsSL "${'$'}PROBE_HOST/api/probe-script/probe-monitor.sh" -o probe-monitor.sh
chmod +x probe-monitor.sh

cat > probe-config.env << EOF
PROBE_HOST=${'$'}PROBE_HOST
PROBE_ID=${'$'}PROBE_ID
PROBE_KEY=${'$'}PROBE_KEY
INTERVAL=${'$'}INTERVAL
EOF

cat > /etc/systemd/system/${'$'}SERVICE_NAME.service << EOF
[Unit]
Description=System Monitoring Probe
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=${'$'}INSTALL_DIR
EnvironmentFile=${'$'}INSTALL_DIR/probe-config.env
ExecStart=${'$'}INSTALL_DIR/probe-monitor.sh
Restart=always
RestartSec=30
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable ${'$'}SERVICE_NAME
systemctl start ${'$'}SERVICE_NAME

sleep 2
if systemctl is-active --quiet ${'$'}SERVICE_NAME; then
  log_success "Probe started successfully"
  echo "Management:"
  echo "  Status: systemctl status ${'$'}SERVICE_NAME"
  echo "  Logs:   journalctl -u ${'$'}SERVICE_NAME -f"
  echo "  Stop:   systemctl stop ${'$'}SERVICE_NAME"
else
  log_error "Failed to start service"
  systemctl status ${'$'}SERVICE_NAME --no-pager
  exit 1
fi
""".trimIndent()
    }

    fun genMonitorScript(): String {
        return """
#!/bin/bash

PROBE_HOST="${'$'}{PROBE_HOST:-http://localhost:8080}"
PROBE_ID="${'$'}{PROBE_ID:-1}"
PROBE_KEY="${'$'}{PROBE_KEY:-default}"
INTERVAL="${'$'}{INTERVAL:-60}"

get_metrics() {
    local cpu_usage memory_usage load_avg

            read cpu_line < /proc/stat
    cpu_now=($(echo ${'$'}cpu_line))
    cpu_sum=$((cpu_now[1] + cpu_now[2] + cpu_now[3] + cpu_now[4]))
    cpu_idle=${'$'}{cpu_now[4]}

    if [ -n "${'$'}prev_cpu_sum" ] && [ -n "${'$'}prev_cpu_idle" ]; then
    cpu_delta=$((cpu_sum - prev_cpu_sum))
    idle_delta=$((cpu_idle - prev_cpu_idle))
    if [ ${'$'}cpu_delta -gt 0 ]; then
    cpu_usage=$(awk "BEGIN {printf \"%.2f\", (1 - ${'$'}idle_delta / ${'$'}cpu_delta) * 100}")
    else
    cpu_usage="0.00"
    fi
    else
    cpu_usage="0.00"
    fi

    prev_cpu_sum=${'$'}cpu_sum
    prev_cpu_idle=${'$'}cpu_idle

    local mem_total mem_available
    while IFS=': ' read -r key value unit; do
        case ${'$'}key in
    MemTotal) mem_total=${'$'}{value%% *} ;;
    MemAvailable) mem_available=${'$'}{value%% *} ;;
    esac
    done < /proc/meminfo

            if [ -n "${'$'}mem_total" ] && [ -n "${'$'}mem_available" ]; then
    memory_usage=$(awk "BEGIN {printf \"%.2f\", (1 - ${'$'}mem_available / ${'$'}mem_total) * 100}")
    else
    memory_usage="0.00"
    fi

    read load_1min load_5min load_15min rest < /proc/loadavg
            load_avg=${'$'}load_1min

    echo "${'$'}cpu_usage ${'$'}memory_usage ${'$'}load_avg"
}

send_data() {
    local cpu=$1 memory=$2 load=$3
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%S.%3NZ)

    local json_data
            printf -v json_data '{"key":"%s","timestamp":"%s","data":{"cpu":%s,"memory":%s,"load":%s}}' \
    "${'$'}PROBE_KEY" "${'$'}timestamp" "${'$'}cpu" "${'$'}memory" "${'$'}load"

    local response=$(curl -s -w "%{http_code}" -X POST \
    --max-time 10 \
    --connect-timeout 5 \
    -H "Content-Type: application/json" \
    -d "${'$'}json_data" \
    "${'$'}PROBE_HOST/api/probe-target/${'$'}PROBE_ID/data" 2>/dev/null)

    local http_code="${'$'}{response: -3}"

    if [ "${'$'}http_code" != "200" ]; then
    logger -t system-probe "HTTP error: ${'$'}http_code"
    return 1
    fi
    return 0
}

trap 'exit 0' SIGTERM SIGINT

get_metrics > /dev/null

while true; do
metrics=($(get_metrics))

if [ ${'$'}{#metrics[@]} -eq 3 ]; then
if ! send_data "${'$'}{metrics[0]}" "${'$'}{metrics[1]}" "${'$'}{metrics[2]}"; then
sleep 10
continue
fi
else
logger -t system-probe "Metrics collection failed"
fi

sleep ${'$'}INTERVAL
done
            """.trimIndent()
    }
}