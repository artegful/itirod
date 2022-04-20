import { Router } from "./Router.js";
import { ToggleFlexContainer } from "./Utility.js";
import { TypingPage } from "./TypingPage.js"
import { ResultPage } from "./ResultPage.js";
import { SettingsPage } from "./SettingsPage.js";

export class PageLoader
{
    constructor(router) 
    {
        this._router = router;
        this._main = document.getElementById("main");
        this._loadingContainer = document.getElementById("loading-container");
        this._sidebar = document.getElementById("sidebar");
        this._sidebarButtons = document.getElementsByClassName("sidebar-toggle");
        this._isSidebarVisible = false;

        for (let i = 0; i < this._sidebarButtons.length; i++)
        {
            this._sidebarButtons[i].onclick = () =>
            {
                this.ToggleSidebar();
            }
        }

        let typingPage = new TypingPage(this._main, "typing");
        this._routeToPage = 
        {
            "" : typingPage,
            "typing" : typingPage,
            "settings" : new SettingsPage(this._main, "settings"),
            "result" : new ResultPage(this._main, "result")
        }
        
        this._router.AddRouteChangedListener((route) => this.LoadPageForRoute(route));
        document.addEventListener("gameFinished", () => this._router.SetRoute("#result"));

        this.LoadPageForRoute(this._router.Route);
    }

    LoadPageForRoute(route)
    {
        let page = this._routeToPage[route];

        if (page != null)
        {
            this.LoadPage(page);
        }
    }

    LoadPage(page) 
    {
        ToggleFlexContainer(this._loadingContainer, true);

        let showPage = () => 
        {
            page.Show(() => 
            {
                ToggleFlexContainer(this._loadingContainer, false);

                this._currentPage = page;
            });
        };

        if (this._currentPage != null)
        {
            this._currentPage.Hide(showPage);
        }
        else
        {
            showPage();
        }
    }

    get CurrentPage()
    {
        return this._currentPage;
    }

    ToggleSidebar()
    {
        this._isSidebarVisible = !this._isSidebarVisible;

        this._sidebar.style.width = this._isSidebarVisible ? "150px" : "0";
    }
}