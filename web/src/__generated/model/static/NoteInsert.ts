export interface NoteInsert {
    readonly title: string;
    readonly content: string;
    readonly password?: string | undefined;
}
