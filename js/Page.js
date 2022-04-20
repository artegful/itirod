export class Page 
{
    constructor(container, name)
    {
        this._container = container;
        this._name = name;
    }

    async Load()
    {
        await fetch(`./pages/${this._name}.html`)
            .then((response) => response.text())
            .then((text) => 
            {
                this._html = text;
            });
    }

    async Show(callback)
    {
        if (this._html == null)
        {
            await this.Load();
        }

        this._container.innerHTML = this._html;
        this.AfterShowingHook();

        callback();
    }

    AfterShowingHook()
    { }

    async Hide(callback) 
    {
        this._container.innerHTML = "";

        callback();
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