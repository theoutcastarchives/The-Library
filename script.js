/* =========================================================
   LIBRARY ESCAPE ROOM
   GAME DATA
========================================================= */

const books = [

    {
        id: "marksBane",

        elementId: "marksBaneBook",

        title: "The Soulfire Moon: The Marks Bane",

        question: null,

        answer: null,

        document:
            "https://docs.google.com/document/d/1FGnVzJkq2PaEC-D4DI0P1fwVx44rbrjc0p96yMb6voU/edit?tab=t.uwjhvxfw39or"
    },


    {
        id: "visionsOfThePast",

        elementId: "visionsOfThePastBook",

        title: "The Soulfire Moon: Visions of the Past",

        question:
            "What is the name of the TSM world?",

        answer:
            "Everglade",

        document:
            "https://docs.google.com/document/d/1IyFH1m4_wqYBXmRJrBQ5npV6D4LG1Bh9bbJr-MR-6DM/edit?tab=t.xb8pgh5ebf4o"
    },


    {
        id: "outcast",

        elementId: "outcastBook",

        title: "Outcast",

        question:
            "What is the odd fire out?",

        answer:
            "Moonfire",

        document:
            "https://docs.google.com/document/d/1ji9xpKi3a3XUg2zu3WBiZdsgkoFRtykhqhEpXT9hNOys/edit?tab=t.q5nc2o6s4j6c"
    },


    {
        id: "rootedBlight",

        elementId: "rootedBlightBook",

        title: "Rooted Blight",

        question:
            "In what chapter does the perspective change?",

        answer:
            "Chapter 3",

        document:
            "https://docs.google.com/document/d/1E4tgwuH6Jir_u1MBl4h7lLIpII3hoE551_EHaSK_dgM/edit?tab=t.mvy1zh263ql"
    },


    {
        id: "shadedTale",

        elementId: "shadedTaleBook",

        title: "A Shaded Tale",

        question:
            "What sound is heard at the beginning that is not at the end?",

        answer:
            "Bells",

        document:
            "https://docs.google.com/document/d/1Pv2kDhjZZmQdQ1BEuJkQ49czQy4c4Ao6IBy34MJNgck/edit?tab=t.rf2dibu8lm5m"
    },


    {
        id: "warriors",

        elementId: "warriorsBook",

        title: "The Warriors",

        question:
            "Count the number of letters and, in the order they appear, enter the total.",

        answer:
            "432112723",

        document:
            "https://docs.google.com/document/d/1RCjTfZSbOeGimGbUKFxIqfbTm0fRQ_dmus6sMvCAQMM/edit?tab=t.ap0fwyxto24y#heading=h.ltbkffvfp4gw"
    }

];


/* =========================================================
   GAME STATE
========================================================= */

const STORAGE_KEY =
    "libraryEscapeRoomProgress";


let unlocked = [];

let currentPuzzle = null;


/* =========================================================
   GET HTML ELEMENTS
========================================================= */

const library =
    document.getElementById("library");

const answerWindow =
    document.getElementById("answerWindow");

const answerBox =
    document.getElementById("answerBox");

const puzzleTitle =
    document.getElementById("puzzleTitle");

const puzzleQuestion =
    document.getElementById("puzzleQuestion");

const answerInput =
    document.getElementById("answerInput");

const answerError =
    document.getElementById("answerError");

const submitAnswer =
    document.getElementById("submitAnswer");

const cancelAnswer =
    document.getElementById("cancelAnswer");

const progress =
    document.getElementById("progress");

const resetEscapeRoom =
    document.getElementById("resetEscapeRoom");

const victoryScreen =
    document.getElementById("victoryScreen");

const playAgain =
    document.getElementById("playAgain");


/* =========================================================
   CREATE NEW GAME
========================================================= */

function createFreshState() {

    unlocked =
        books.map(() => false);

    // First book is always unlocked.
    unlocked[0] = true;
}


/* =========================================================
   SAVE GAME
========================================================= */

function saveGame() {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(unlocked)
    );
}


/* =========================================================
   LOAD GAME
========================================================= */

function loadGame() {

    const saved =
        localStorage.getItem(STORAGE_KEY);


    if (!saved) {

        createFreshState();

        saveGame();

        return;
    }


    try {

        const parsed =
            JSON.parse(saved);


        if (
            !Array.isArray(parsed) ||
            parsed.length !== books.length
        ) {

            createFreshState();

            saveGame();

            return;
        }


        unlocked =
            parsed.map(value => Boolean(value));


        // The first book can never be locked.
        unlocked[0] = true;


        /*
            Prevent impossible progress.

            A player cannot have Book 5 unlocked
            while Book 4 is still locked.
        */

        for (
            let i = 1;
            i < unlocked.length;
            i++
        ) {

            if (!unlocked[i - 1]) {

                unlocked[i] = false;
            }
        }


        saveGame();

    } catch (error) {

        console.error(
            "Could not load saved game:",
            error
        );


        createFreshState();

        saveGame();
    }
}


/* =========================================================
   GET BOOK ELEMENT
========================================================= */

function getBookElement(index) {

    return document.getElementById(
        books[index].elementId
    );
}


/* =========================================================
   UPDATE BOOKS
========================================================= */

function updateBooks() {

    for (
        let i = 0;
        i < books.length;
        i++
    ) {

        const bookElement =
            getBookElement(i);


        if (!bookElement) {
            continue;
        }


        /*
            BOOK 1

            Always visible and unlocked.
        */

        if (i === 0) {

            bookElement.classList.remove(
                "hidden"
            );

            bookElement.classList.add(
                "unlocked"
            );

            continue;
        }


        /*
            UNLOCKED BOOK

            Visible and clickable.
        */

        if (unlocked[i]) {

            bookElement.classList.remove(
                "hidden"
            );

            bookElement.classList.add(
                "unlocked"
            );

            continue;
        }


        /*
            NEXT LOCKED BOOK

            Visible if the previous book
            has been unlocked.
        */

        if (unlocked[i - 1]) {

            bookElement.classList.remove(
                "hidden"
            );

            bookElement.classList.remove(
                "unlocked"
            );

        }


        /*
            FUTURE BOOK

            Completely hidden.
        */

        else {

            bookElement.classList.add(
                "hidden"
            );

            bookElement.classList.remove(
                "unlocked"
            );
        }
    }


    updateProgress();
}


/* =========================================================
   UPDATE PROGRESS
========================================================= */

function updateProgress() {

    const count =
        unlocked.filter(
            value => value === true
        ).length;


    progress.textContent =
        `Books unlocked: ${count}/${books.length}`;
}


/* =========================================================
   OPEN BOOK
========================================================= */

function openBook(index) {

    const book =
        books[index];


    /*
        If the book is unlocked,
        open its Google Doc.
    */

    if (unlocked[index]) {

        window.open(
            book.document,
            "_blank",
            "noopener,noreferrer"
        );

        return;
    }


    /*
        A locked book can only be solved
        if the previous book is unlocked.
    */

    if (
        index > 0 &&
        !unlocked[index - 1]
    ) {

        return;
    }


    /*
        Book 1 does not have a puzzle.
    */

    if (!book.question) {

        window.open(
            book.document,
            "_blank",
            "noopener,noreferrer"
        );

        return;
    }


    /*
        Open puzzle.
    */

    currentPuzzle = index;


    puzzleTitle.textContent =
        book.title;


    puzzleQuestion.textContent =
        book.question;


    answerInput.value = "";

    answerError.textContent = "";


    answerWindow.classList.add(
        "open"
    );


    /*
        Wait one tiny moment so the
        browser can focus the input.
    */

    setTimeout(() => {

        answerInput.focus();

    }, 50);
}


/* =========================================================
   CLOSE PUZZLE
========================================================= */

function closePuzzle() {

    answerWindow.classList.remove(
        "open"
    );

    currentPuzzle = null;

    answerInput.value = "";

    answerError.textContent = "";
}


/* =========================================================
   CHECK ANSWER
========================================================= */

function checkAnswer() {

    if (
        currentPuzzle === null
    ) {

        return;
    }


    const book =
        books[currentPuzzle];


    const userAnswer =
        answerInput.value
            .trim()
            .toLowerCase();


    const correctAnswer =
        book.answer
            .trim()
            .toLowerCase();


    /*
        Empty answer.
    */

    if (!userAnswer) {

        answerError.textContent =
            "Please enter an answer.";

        answerInput.focus();

        return;
    }


    /*
        WRONG ANSWER
    */

    if (
        userAnswer !== correctAnswer
    ) {

        answerError.textContent =
            "That answer is incorrect. Try again.";

        answerInput.select();

        return;
    }


    /*
        IMPORTANT:

        Save the index before closing the puzzle,
        because closePuzzle() sets currentPuzzle
        to null.
    */

    const solvedIndex =
        currentPuzzle;


    /*
        Unlock the book.
    */

    unlocked[solvedIndex] =
        true;


    saveGame();


    /*
        Close puzzle.
    */

    closePuzzle();


    /*
        Update library.
    */

    updateBooks();


    /*
        If this was the FINAL book,
        show victory.
    */

    if (
        solvedIndex === books.length - 1
    ) {

        victoryScreen.classList.add(
            "show"
        );
    }
}


/* =========================================================
   RESET GAME
========================================================= */

function resetGame() {

    const confirmed =
        confirm(
            "Are you sure you want to reset the entire escape room?"
        );


    if (!confirmed) {

        return;
    }


    localStorage.removeItem(
        STORAGE_KEY
    );


    createFreshState();

    saveGame();


    closePuzzle();


    victoryScreen.classList.remove(
        "show"
    );


    updateBooks();
}


/* =========================================================
   LIBRARY CLICK HANDLER
========================================================= */

library.addEventListener(
    "click",
    function(event) {

        const bookElement =
            event.target.closest(
                ".bookArea"
            );


        /*
            Click wasn't on a book.
        */

        if (!bookElement) {

            return;
        }


        /*
            Hidden books should never
            be clickable.
        */

        if (
            bookElement.classList.contains(
                "hidden"
            )
        ) {

            return;
        }


        const bookId =
            bookElement.dataset.book;


        const index =
            books.findIndex(
                book => book.id === bookId
            );


        if (index === -1) {

            return;
        }


        openBook(index);
    }
);


/* =========================================================
   SUBMIT ANSWER
========================================================= */

submitAnswer.addEventListener(
    "click",
    checkAnswer
);


/* =========================================================
   CANCEL PUZZLE
========================================================= */

cancelAnswer.addEventListener(
    "click",
    closePuzzle
);


/* =========================================================
   RESET BUTTON
========================================================= */

resetEscapeRoom.addEventListener(
    "click",
    resetGame
);


/* =========================================================
   PLAY AGAIN
========================================================= */

playAgain.addEventListener(
    "click",
    function() {

        victoryScreen.classList.remove(
            "show"
        );

        resetGame();
    }
);


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /*
            ENTER = submit answer
        */

        if (
            event.key === "Enter" &&
            answerWindow.classList.contains("open")
        ) {

            event.preventDefault();

            checkAnswer();

            return;
        }


        /*
            ESCAPE = close puzzle
        */

        if (
            event.key === "Escape" &&
            answerWindow.classList.contains("open")
        ) {

            closePuzzle();
        }
    }
);


/* =========================================================
   CLICK OUTSIDE PUZZLE BOX
========================================================= */

answerWindow.addEventListener(
    "click",
    function(event) {

        /*
            Only close when clicking the
            dark background, not the box.
        */

        if (
            event.target === answerWindow
        ) {

            closePuzzle();
        }
    }
);


/* =========================================================
   START GAME
========================================================= */

function startGame() {

    loadGame();

    updateBooks();

    closePuzzle();

    victoryScreen.classList.remove(
        "show"
    );
}


/* =========================================================
   START
========================================================= */

startGame();