import { Page } from "./Page.js";
import { PageLoader } from "./PageLoader.js";
import { TypingController } from "./TypingController.js";
import { ToggleContainer } from "./Utility.js";

export class TypingPage extends Page
{
    constructor(container, name)
    {
        super(container, name);

        this._typingController = new TypingController();
    }

    async Load()
    {
        await super.Load();

        await this._typingController.LoadDictionary();
    }

    async Show(callback) 
    {
        if (this._html == null)
        {
            await this.Load();
        }

        this._container.innerHTML = this._html;
        this._typingContainer = document.getElementById("typing-container");

        ToggleContainer(this._container, false);
        await this._typingController.Initialize();
        ToggleContainer(this._container, true);
        this._typingContainer.focus();

        callback();
    }

    Hide()
    {
        this._typingController.Cleanup();
    }
}