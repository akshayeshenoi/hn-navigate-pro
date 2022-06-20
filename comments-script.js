const comments = document.querySelectorAll("table.comment-tree tr.athing.comtr")
let commentSelectedIndex = -1;

document.addEventListener('keypress', detectKey);

function detectKey(key) {
    if (!['KeyJ', 'KeyK', 'KeyX'].includes(key.code)) return;

    if (commentSelectedIndex == -1) {
        // select first comment
        commentSelectedIndex = 0;
        addbox(comments[commentSelectedIndex]);

        return;
    }

    if (key.code == 'KeyJ') {
        // go down
        if (commentSelectedIndex >= comments.length - 1) return;
        // remove older selected comment
        removebox(comments[commentSelectedIndex]);

        // select next comment
        commentSelectedIndex = getNextCommentIdx(commentSelectedIndex);
        addbox(comments[commentSelectedIndex]);

        scrollDownIfNecessary();

        return;
    }
    

    if (key.code == 'KeyK') {
        // go up
        if (commentSelectedIndex <= 0) return;
        // remove older selected comment
        removebox(comments[commentSelectedIndex]);

        // select previous comment
        commentSelectedIndex = getPrevCommentIdx(commentSelectedIndex);
        addbox(comments[commentSelectedIndex]);

        scrollUpIfNecessary();

        return;
    }

    if (key.code == 'KeyX') {
        // select next comment and collapse current comment
        if (commentSelectedIndex == -1) return;

        comments[commentSelectedIndex].querySelector('a.togg').click()

        return;
    }
}

function getNextCommentIdx(afterCommentIdx) {
    // cycle through comments until we find non-hidden comment
    let nextCommentIdx = afterCommentIdx;
    for (let i = commentSelectedIndex + 1; i < comments.length - 1; i++) {
        if(comments[i].className.includes('noshow'))
        {
            continue;
        }
        else {
            nextCommentIdx = i;
            break;
        }
    }

    return nextCommentIdx;
}

function getPrevCommentIdx(beforeCommentIdx) {
    // cycle through comments until we find non-hidden comment
    let nextCommentIdx = beforeCommentIdx;
    for (let i = commentSelectedIndex - 1; i >= 0; i--) {
        if(comments[i].className.includes('noshow'))
        {
            continue;
        }
        else {
            nextCommentIdx = i;
            break;
        }
    }

    return nextCommentIdx;
}

function scrollDownIfNecessary() {
    const bottom = comments[commentSelectedIndex].getBoundingClientRect().bottom;
    const height = comments[commentSelectedIndex].getBoundingClientRect().height;

    if (bottom + 10 > window.innerHeight) {
        // scroll by one box amount
        window.scroll(0, window.scrollY + height + 10);
    }
}

function scrollUpIfNecessary() {
    const top = comments[commentSelectedIndex].getBoundingClientRect().top;
    const height = comments[commentSelectedIndex].getBoundingClientRect().height;

    if (top - 10 < 0) {
        // scroll by one box amount
        window.scroll(0, window.scrollY - (height + 10));
    }
}


function addbox(comment) {
    // adds darker shade
    comment.style['background-color'] = '#ebebdf';
}

function removebox(comment) {
    // removes darker shade
    comment.style['background-color'] = 'inherit';
}
