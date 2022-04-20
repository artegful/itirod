import { PageLoader } from "./PageLoader.js";
import { GetAbsolutePosition, ToggleElement } from "./Utility.js";

const modes = { time: 'time', words: 'words' };

export class TypingController 
{
    constructor()
    {
        this._totalTime = 12;
        this._totalWords = 10;
        this._words = [];

        this._timeButtons = document.getElementsByClassName("time-button");
        this._wordsButtons = document.getElementsByClassName("word-button");

        for (let i = 0; i < this._timeButtons.length; i++)
        {
            this._timeButtons[i].onclick = () => 
            {
                this._mode = modes.time;
                this.Restart();

                for (let i = 0; i < this._timeButtons.length; i++)
                {
                    this._timeButtons[i].classList.add("selected");
                    this._wordsButtons[i].classList.remove("selected");
                }
            }

            this._wordsButtons[i].onclick = () => 
            {
                this._mode = modes.words;
                this.Restart();

                for (let i = 0; i < this._timeButtons.length; i++)
                {
                    this._wordsButtons[i].classList.add("selected");
                    this._timeButtons[i].classList.remove("selected");
                }
            }
        }
        
        this._mode = modes.time;
    }

    async LoadDictionary()
    {
        await fetch("https://random-word-api.herokuapp.com/word?number=100")
            .then((response) => response.json())
            .then((words) => this._words = words);
    }

    async Initialize()
    {
        this._restartButton = document.getElementById("restart-button");

        this._restartButton.onclick = () => 
        {
            this.Restart();
        };

        this._typingText = document.getElementById("typing-text");
        this._typingContainer = document.getElementById("typing-container");
        this._counter = document.getElementById("timer");

        this._counter.innerText = this._mode == modes.time ? 
            this._totalTime : this._totalWords;

        this._cursor = document.getElementById("typing-cursor");

        this._typingContainer.onkeydown = (event) => this.OnKeyDown(event.key);

        //if mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
        {     
            this._hiddenInput = document.getElementById("input");

            //couldn't find a good way to trigger keyboard on mobile, so there is a zero size input
            //(not hidden, because they are unfocusable)
            this._typingContainer.onfocus = () => 
            {
                this._hiddenInput.focus();
                this._hiddenInput.click();
            };

            //keyup and down are triggered on mobile, but key codes are wrong
            //this is simulating key input with <input>
            this._previousMobileInputLength = 0;
            this._hiddenInput.value = "";
            this._hiddenInput.oninput = () =>
            {
                this.OnMobileInputChanged();
            };
        }

        this._typedCharacters = 0;
        this._typedWords = 0;
        this._errorCharacters = 0;
        this._spans = [];

        this._typingText.innerHTML = "";

        let gameSessionWords = []

        for (let i = 0; i < this._totalWords; i++)
        {
            gameSessionWords.push(this._words[Math.floor(Math.random() * this._words.length)]);
        }

        let text = gameSessionWords.join(" ");

        for (let i = 0; i < text.length; i++)
        {
            let span = document.createElement("span");
            span.innerText = text[i];

            this._spans.push(span);
            this._typingText.appendChild(span);
        }
    }

    Restart()
    {
        this.Cleanup();
        this.Initialize();
    }

    OnKeyDown(key)
    {
        if (key === "Tab" || this._typedCharacters === this._spans.length)
        {
            return;
        }

        if (key === "Backspace")
        {
            this.HandleBackspace();
            return;
        }

        this.HandleNextCharacter(key);
    }

    OnMobileInputChanged()
    {
        let text = this._hiddenInput.value;
        alert(text);
        let character;

        if (text.length < this._previousMobileInputLength)
        {
            character = "Backspace";
        }
        else
        {
            character = text[text.length - 1];
        }

        this._previousMobileInputLength = text.length;
        this.OnKeyDown(character);
    }

    HandleBackspace()
    {
        if (this._typedCharacters === 0)
        {
            return;
        }

        this.ChangeTypedCharacters(-1);

        let span = this._spans[this._typedCharacters];
        span.className = "";

        if (span.innerText === " ")
        {
            this.ChangeTypedWords(-1);
        }
    }

    HandleNextCharacter(key)
    {
        if (this._startTime == null)
        {
            this.Start();
        }

        let span = this._spans[this._typedCharacters];
        let isCorrect = span.innerText === key;

        if (!isCorrect)
        {
            this._errorCharacters++;
        }
        span.classList.add(isCorrect ? "typing-complete" : "typing-error");

        if (span.innerText === " ")
        {
            this.ChangeTypedWords(1);
        }

        this.ChangeTypedCharacters(1);

        if (this._typedCharacters === this._spans.length)
        {
            this.Finish();
        }
    }

    ChangeTypedCharacters(change)
    {
        this._typedCharacters += change;

        this.UpdateCursorPosition();
    }

    ChangeTypedWords(change)
    {
        this._typedWords += change;
        
        if (this._mode == modes.words)
        {
            this._counter.innerText = this._totalWords - this._typedWords;
        }
    }

    Start()
    {
        this.StartCountdown();

        this.UpdateCursorPosition();
        ToggleElement(this._cursor, true);
    }

    UpdateCursorPosition()
    {
        if (this._typedCharacters === this._spans.length)
        {
            return;
        }

        const absolutePosition = GetAbsolutePosition(this._spans[this._typedCharacters]);

        this._cursor.style.left = absolutePosition.left - 3 + "px";
        this._cursor.style.top = absolutePosition.top + "px";
    }

    Cleanup()
    {
        clearInterval(this._countdown);
        ToggleElement(this._cursor, false);
        this._startTime = null;
    }

    Finish()
    {
        let gameFinished = new CustomEvent("gameFinished", {
            bubbles: true,
            cancelable: false,
            detail: {
                totalCharacters: this._typedCharacters,
                errors: this._errorCharacters,
                timeInMiliseconds: new Date().getTime() - this._startTime 
            }
        });

        document.dispatchEvent(gameFinished);

        this.Cleanup();
    }

    StartCountdown()
    {
        this._startTime = new Date().getTime();

        if (this._mode == modes.time)
        {
            this._countdown = setInterval(() =>
            {
                let now = new Date().getTime();
    
                let interval = Math.floor((now - this._startTime) / 1000);
                let remainingTime = this._totalTime - interval;
                this._counter.innerText = remainingTime;
    
                if (remainingTime <= 0)
                {
                    this.Finish();
                }
            }, 1000);
        }
    }
}