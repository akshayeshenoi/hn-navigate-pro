const athings = document.querySelectorAll("tr.athing")
let athingSelectedIndex = -1;

document.addEventListener('keypress', detectKey);
document.addEventListener('click', function(event) {
    // user may have choses to click on a link
    // OR may have chosen press enter AFTER previously clicking on a link
    // (probably because of default browser behaviour for enter on hyperlink)
    // if it's enter, we should prevent default and delegate to keypress handler
    if (event.pointerType === '') {
        event.preventDefault();
        // delegate event
        const fakeKey = { code: 'Enter' };
        detectKey(fakeKey);
        return;
    }

    // user clicked on link
    // update our state and open in new tab
    if (event.target.tagName === 'A' &&
        event.target.parentElement && 
        event.target.parentElement.classList.length === 1 &&
        event.target.parentElement.classList[0] === 'titleline'
       ) {

        event.preventDefault();

        // get id of the athing
        const thisAthingID = event.target.parentElement.parentElement.parentElement.id;

        // loop through athings to match ID
        let i = 0;
        for (let athing of athings) {
            if (athing.id === thisAthingID) {
                // this is our link

                if (athingSelectedIndex !== -1)
                    // remove older selected athing
                    removebox(athings[athingSelectedIndex]);

                athingSelectedIndex = i;
                addbox(athings[athingSelectedIndex]);

                const link = athings[athingSelectedIndex].querySelector("td:nth-child(3) a");
                window.open(link.href, "_blank");
                return;
            }
            i++;
        }        
    }
});

function detectKey(key) {
    if (!['KeyJ', 'KeyK', 'Enter', 'KeyC'].includes(key.code)) return;

    if (athingSelectedIndex == -1) {
        // select first athing
        athingSelectedIndex = 0;
        addbox(athings[athingSelectedIndex]);

        return;
    }

    if (key.code == 'KeyJ') {
        // go down
        if (athingSelectedIndex >= athings.length - 1) return;
        // remove older selected athing
        removebox(athings[athingSelectedIndex]);

        // select next athing
        athingSelectedIndex++;
        addbox(athings[athingSelectedIndex]);

        scrollDownIfNecessary();

        return;
    }
    

    if (key.code == 'KeyK') {
        // go up
        if (athingSelectedIndex <= 0) return;
        // remove older selected athing
        removebox(athings[athingSelectedIndex]);

        // select previous athing
        athingSelectedIndex--;
        addbox(athings[athingSelectedIndex]);

        scrollUpIfNecessary();

        return;
    }

    if (key.code == 'Enter') {
        // open link
        // new tab if shift is pressed
        // todo:^ (shift seems to override click behaviour)
        // skipping feature for now
        if (athingSelectedIndex == -1) return;

        const link = athings[athingSelectedIndex].querySelector("td:nth-child(3) a");
        window.open(link.href, "_blank");

        return;
    }

    if (key.code == 'KeyC') {
        // open comments
        if (athingSelectedIndex == -1) return;

        // first select next sibling (it's not nested for some reason)
        const athingSubtext = athings[athingSelectedIndex].nextElementSibling;
        const commentLink = athingSubtext.querySelector("td.subtext > a:nth-child(6)");

        window.open(commentLink.href, "_blank");

        return;
    }

}

function scrollDownIfNecessary() {
    // get height and y coord of element (including the subtext, which is the next sibling element)
    const height = athings[athingSelectedIndex].getBoundingClientRect().height
                    + athings[athingSelectedIndex].nextElementSibling.getBoundingClientRect().height;

    const bottom = athings[athingSelectedIndex].nextElementSibling.getBoundingClientRect().bottom;

    if (bottom + 10 > window.innerHeight) {
        // scroll by one box amount
        window.scroll(0, window.scrollY + height + 10);
    }
}

function scrollUpIfNecessary() {
    // get height and y coord of element (including the subtext, which is the next sibling element)
    const top = athings[athingSelectedIndex].getBoundingClientRect().top;

    const height = athings[athingSelectedIndex].getBoundingClientRect().height
                    + athings[athingSelectedIndex].nextElementSibling.getBoundingClientRect().height;

    if (top - 10 < 0) {
        // scroll by one box amount
        window.scroll(0, window.scrollY - (height + 10));
    }
}

function addbox(athing) {
    // adds box around link title
    athing.querySelector("td:nth-child(3)").style['border'] = "2px #4848dc solid";
}

function removebox(athing) {
    // removes box around link title
    athing.querySelector("td:nth-child(3)").style['border'] = "none";
}
