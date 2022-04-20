import { Page } from "./Page.js";

export class SettingsPage extends Page
{
    AfterShowingHook()
    {
        this._themeButtons = document.getElementsByClassName("settings-button");
        this._linkTheme = document.getElementById("theme-link");
        this._themeIndicator = document.getElementById("theme-indicator");

        for (let i = 0; i < this._themeButtons.length; i++)
        {
            let button = this._themeButtons[i];

            button.onclick = () => 
            {
                this.ApplyTheme(button.innerText);
            };
        }
    }

    ApplyTheme(name)
    {
        this._linkTheme.setAttribute("href", `./css/${name}.css`);
        this._themeIndicator.innerText = name;
    }
}