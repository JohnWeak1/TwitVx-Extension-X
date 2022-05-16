var inter; //interval 

function specparent(a, b) { //returns parent element with specific tag, a is child and b is parent's tag
    for (b = b.toLowerCase(); a && a.parentNode;)
        if (a = a.parentNode, a.tagName && a.tagName.toLowerCase() == b) return a;
    return null
}

function styleAppend() {
    const css = ` 
            .vxtwitterclass {
                background-color: unset;
            }
            body[style*="background-color: rgb(21, 32, 43)"] .vxtwitterclass:hover,
            body[style*="background-color: #15202B"] .vxtwitterclass:hover {
                background-color: rgba(255, 255, 255, 0.03);
            }
            body[style*="background-color: rgb(255, 255, 255)"] .vxtwitterclass:hover,
            body[style*="background-color: #FFFFFF"] .vxtwitterclass:hover {
                background-color: rgba(0, 0, 0, 0.03);
            }`; //stylesheet for the new rclick items, it is best to keep this here so twitter doesnt overwrite it
    const style = document.createElement('style'); //creates style el
    style.styleSheet ? style.styleSheet.cssText = css : style.appendChild(document.createTextNode(css));
    style.id = "TwitVx";
    document.getElementsByTagName('head')[0].appendChild(style); //appends to head
}

document.addEventListener('contextmenu', (e) => { //event for right click
    const varray = Array.from(document.querySelectorAll("div[data-testid*='videoPlayer']")).filter(i => i.contains(e.target)); //this is array of targets
    const videoPlayer = varray[0];
    const article = specparent(videoPlayer, "article");
    if (varray.length > 0 && Array.from(article.querySelectorAll("a")).filter(a => a.href.includes("broadcasts")).length < 1 && videoPlayer != article.querySelector("div[role=\"link\"] [data-testid=\"videoPlayer\"]")) { //checks if rclick was over video player 
        const atags = Array.from(article.querySelectorAll("a"));
        const url = atags.filter(a => a.href.includes("status"))[0].href; //url is pulled from a A tag inside the tweet (article)
        if (!document.getElementById("TwitVx"))
            styleAppend();
        function change() { //function for simplicity
            const ogitem = videoPlayer.querySelector("div[role*='menuitem']"); //original item <> Copy Video Adress
            const flex = ogitem.parentElement; //container/parent
            if (!flex.contains(flex.querySelector(".vxtwitterclass"))) { //checks if vxtwitter items are already there
                const opt1 = ogitem.cloneNode(true); //clones a copy of ogitem
                opt1.querySelector("span").textContent = "Copy TwitVx Link"; //item text
                opt1.classList.add("vxtwitterclass"); //class
                opt1.addEventListener("click",
                    () => {
                        navigator.clipboard.writeText(url.replace("https://", "https://vx")) //adds click event and using navigator api, copies the url to clipboard
                        document.body.click();
                    }
                );

                const opt2 = ogitem.cloneNode(true); //same as above
                opt2.querySelector("span").textContent = "Copy MP4 Link";
                opt2.classList.add("vxtwitterclass");
                opt2.addEventListener("click",
                    () => {
                        navigator.clipboard.writeText(url.replace("https://", "https://vx").concat(".mp4"));
                        document.body.click();
                    }
                );

                flex.append(opt1); //appends to container/parent
                flex.append(opt2);
            }
        }
        //Interval that checks every 4ms after rclick, waits until twitter's context menu appears then applies change and finally stops
        //Todo: Find a better way to handle this, current imp. can cause potential bugs
        var step = 0; //added so it stops after a while
        if (!inter) {
            inter = setInterval(() => {
                step += 1;
                if (videoPlayer.querySelector("div[role*='menuitem']") != null) { //checks if twitter's context menu exists
                    change();
                    step = 0;
                    clearInterval(inter);
                    inter = "";
                } else if (step > 10000) {
                    step = 0;
                    clearInterval(inter);
                    inter = "";
                }
            }, 4);
        }

    }
}, false);

window.onload = () => {
    styleAppend();
    setInterval(() => {
        if (document.querySelector("div:not(.vxTwittered)[class][role*='button'][aria-label*='Share Tweet']") != null) {
            shareAppend();
        }
    }, 4);
};

function shareAppend() {
    document.querySelectorAll("div:not(.vxTwittered)[class][role*='button'][aria-label*='Share Tweet']").forEach(shrbtn => {
        shrbtn.classList.add("vxTwittered");
        shrbtn.addEventListener("click", () => {
            if (!document.getElementById("TwitVx"))
                styleAppend();
            function shareChange() {
                const article = specparent(shrbtn, "article");
                const atags = Array.from(article.querySelectorAll("a"));
                const url = atags.filter(a => a.href.includes("status") && !a.href.includes("photo") && !a.href.includes("video"))[0].href; //url is pulled from a A tag inside the tweet (article)
                const ogitem = document.querySelectorAll("div[role*='menuitem']")[2] ? document.querySelectorAll("div[role*='menuitem']")[2] : document.querySelector("div[role*='menuitem']");
                const flex = ogitem.parentElement; //not actual menu but container of menuitems
                const menu = document.querySelector("div[role*='menu']");
                if (!flex.contains(flex.querySelector(".vxtwitterclass"))) { //checks if vxtwitter items are already there
                    const opt1 = ogitem.cloneNode(true); //clones a copy of ogitem
                    opt1.querySelector("span").textContent = "Copy TwitVx link"; //item text
                    opt1.classList.add("vxtwitterclass"); //class
                    opt1.addEventListener("click", () => {
                        navigator.clipboard.writeText(url.replace("https://", "https://vx"));
                        menu.remove();
                    }); //adds click event and using navigator api, copies the url to clipboard);
                    flex.insertBefore(opt1, ogitem.nextSibling); //appends to container/parent
                }
            }
            //Todo: Find a better way to handle this, current imp. can cause potential bugs
            var step = 0; //added so it stops after a while
            if (!inter) {
                inter = setInterval(() => {
                    step++;
                    if (document.querySelector("div[role*='menuitem']") != null) {
                        shareChange();
                        step = 0;
                        clearInterval(inter);
                        inter = "";
                    } else if (step > 10000) {
                        step = 0;
                        clearInterval(inter);
                        inter = "";
                    }
                }, 4);
            }
        }, false);
    });
}
