export class Page 
{
    constructor(container, name)
    {
        this._container = container;
        this._name = name;
    }

    async Load()
    {
        let response = await fetch(`./pages/${this._name}.html`);
        this._html = await response.text();
    }

    async Show(callback)
    {
        if (this._html === undefined)
        {
            await this.Load();
        }

        this._container.innerHTML = this._html;
        this.AfterShowingHook();

        callback();
    }

    AfterShowingHook()
    { }

    Hide() 
    {
        this._container.innerHTML = "";
    }

    get Name()
    {
        return this._name;
    }

    get HTML()
    {
        return this._html;
    }
}