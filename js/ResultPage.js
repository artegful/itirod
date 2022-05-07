import { Page } from "./Page.js";
import { ToggleElement } from "./Utility.js";

export class ResultPage extends Page
{
    constructor(container, name)
    {
        super(container, name);

        document.addEventListener("gameFinished", (event) =>
        {
            this._latestStats = event.detail;
        });
    }

    AfterShowingHook()
    {
        this._wpm = document.getElementById("wpm");
        this._accuracy = document.getElementById("accuracy");
        this._warning = document.getElementById("result-warning");

        if (this._latestStats == null)
        {
            ToggleElement(this._warning, true);
            return;
        }

        ToggleElement(this._warning, false);

        const averageCharactersInWord = 5;
        let correctCharacters = this._latestStats.totalCharacters - this._latestStats.errors;
        correctCharacters = correctCharacters > 0 ? correctCharacters : 1;

        let wpm = Math.floor(correctCharacters * 60 / 
            this._latestStats.timeInMiliseconds * 1000 / averageCharactersInWord);

        let accuracy = this._latestStats.totalCharacters > 0 ? 
        (correctCharacters) / this._latestStats.totalCharacters * 100 : 0;

        this._wpm.innerText = wpm;
        this._accuracy.innerText = accuracy.toFixed(0) + "%";
    }
}