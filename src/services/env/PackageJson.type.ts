export class PackageJson {
    public name?: string;
    public version?: string;
    public description?: string;
    public author?: string;

    constructor ( init: Partial<PackageJson> ) {
        this.name = init.name
        this.version = init.version
        this.description = init.description
        this.author = init.author
    }
}
