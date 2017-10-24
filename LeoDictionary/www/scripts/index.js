// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";
    
    document.addEventListener('deviceready', onDeviceReady.bind(this), false);

    function onDeviceReady() {
        //document.addEventListener("backbutton", onBackKeyDown, false);
        //function onBackKeyDown() {
            
        //}

/*
        setInterval(function () {
            var w = window,
            d = document,
            e = d.documentElement,
            g = d.getElementsByTagName('body')[0],
            x = w.innerWidth || e.clientWidth || g.clientWidth,
            y = w.innerHeight || e.clientHeight || g.clientHeight;

            //document.getElementById("Translate2").value = x + "x" + y;
            document.getElementById("Translate2").value = darkThemeModeActive();
        }, 300);
*/
        

        // Handle the Cordova pause and resume events
        //document.addEventListener( 'pause', onPause.bind( this ), false );
        //document.addEventListener( 'resume', onResume.bind( this ), false );
        
        //// TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        //var parentElement = document.getElementById('deviceready');
        //var listeningElement = parentElement.querySelector('.listening');
        //var receivedElement = parentElement.querySelector('.received');
        //listeningElement.setAttribute('style', 'display:none;');
        //receivedElement.setAttribute('style', 'display:block;');
        
        (function () {
            if (typeof Object.defineProperty === 'function') {
                try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e) { }
            }
            if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

            function sb(f) {
                for (var i = this.length; i;) {
                    var o = this[--i];
                    this[i] = [].concat(f.call(o, o, i), o);
                }
                this.sort(function (a, b) {
                    for (var i = 0, len = a.length; i < len; ++i) {
                        if (a[i] != b[i]) return a[i] < b[i] ? -1 : 1;
                    }
                    return 0;
                });
                for (var i = this.length; i;) {
                    this[--i] = this[i][this[i].length - 1];
                }
                return this;
            }
        })();
        //leo new word without limitation
        //$(".transword-form__input").val("застревать, глохнуть, останавливаться, киоск, ларек, стойло")

        var transcriptionClass = "transcription";
        var transcriptionTextClass = "transcriptionText";
        var hoverClass = "hover";
        var exactClass = "exact";

        function trimChar(string, charToRemove) {
            while (string.charAt(0) == charToRemove) {
                string = string.substring(1);
            }

            while (string.charAt(string.length - 1) == charToRemove) {
                string = string.substring(0, string.length - 1);
            }

            return string;
        }

        function showHistoryForDays() {
            var days = localStorage.getItem("ShowHistoryForDays");
            if (!days || days <= 0) {
                localStorage.setItem("ShowHistoryForDays", 30);
            }
            return days;
        }

        function saveHistoryForDays() {
            var days = localStorage.getItem("SaveHistoryForDays");
            if (!days || days <= 0) {
                localStorage.setItem("SaveHistoryForDays", 30);
            }
            return days;
        }

        function trim(text) {
            if (text) {
                var result = text.replace(/^([ ]+)|[ ]+$/gm, "");
                return result.replace(/\r?\n|\r/g, "");
            }
            return "";
        }

        function trimSymbols(text) {
            if (text) {
                var result = text.replace(/^([;, ]+)|[;, ]+$/gm, "");
                return result.replace(/\r?\n|\r/g, "");
            }
            return "";
        }

        function replaceAll(str1, str2, ignoreCase) {
            ignoreCase = ignoreCase || true;
            return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g, "\\$&"), (ignoreCase ? "gi" : "g")), (typeof (str2) == "string") ? str2.replace(/\$/g, "$$$$") : str2);
        }

        function playSound(el) {
            if (el.mp3) {
                if (el.mp3.paused) el.mp3.play();
                else el.mp3.pause();
            } else {
                var url = el.dataset.mp3;
                if (url && url != '') {
                    el.mp3 = new Audio(url);
                    el.mp3.play();
                }
            }
        }

        function historyModeActive() {
            var color = document.getElementById("ShowHistory").style.color;
            if (color == "Red" || color == "red") {
                return true;
            }
            return false;
        }

        function orderHistoryByDateModeActive() {
            if (document.getElementById("OrderHistoryByDate").checked) {
                return true;
            }
            return false;
        }

        function darkThemeModeActive() {
            var darkTheme = localStorage.getItem("darkTheme");
            if (darkTheme != undefined && darkTheme == "true") {
                return true;
            }
            return false;
        }

        function DictionaryWord(word, translation, transcription, mp3Url) {
            word = word.toLowerCase();
            translation = translation.toLowerCase();

            this.transcription = transcription;

            var curWord = "";

            var wordss = [];
            var wordWords = word.split(" ");
            for (var i = 0; i < wordWords.length; i++) {
                curWord = trimSymbols(wordWords[i]);
                wordss.push(curWord);
            }
            this.words = wordss;
            this.word = word;

            this.mp3Url = mp3Url || "";

            var translationss = [];
            var translationWords = translation.split(",");
            for (var i = 0; i < translationWords.length; i++) {
                curWord = trimSymbols(translationWords[i]);
                translationss.push(curWord);
            }
            this.translationWords = translationss;
            this.translation = translation;

            this.wordsAll = wordss.concat(translationss);

            this.searchString = this.word + " " + this.translation;
            this.contains = function (searchText) {
                return this.searchString.indexOf(searchText) >= 0;
            }
            this.containsExact = function (searchText) {
                return this.word == searchText || this.translation == searchText;
            }
            this.startsWith = function (searchText) {
                return this.word.startsWith(searchText) || this.translation.startsWith(searchText);
            }
            this.startsWithWord = function (searchText) {
                return this.words[0] == searchText || this.translationWords[0] == searchText;
            }
            this.containsWord = function (searchText) {
                return this.wordsAll.indexOf(searchText) != -1;
            }
        }

        var allwords = [];
        function loadAllWords() {
            if (allwords.length == 0) {
                /*
				var trItems = document.getElementById("word-table").children[0].children;
				for (var i = 0; i < trItems.length; i++) {
					var columns = trItems[i].children;
					var newWord = new DictionaryWord(columns[1].innerText, columns[3].innerText, columns[2].innerText);
					allwords.push(newWord);
				}
				trItems = null;
				*/

                var wordContent = document.getElementById("WordsCsvContainer").innerText.split("\n");
                for (var i = 0; i < wordContent.length; i++) {
                    if (wordContent[i] != "") {
                        var columns = trim(wordContent[i]).split(";");
                        var newWord = new DictionaryWord(trimChar(columns[0], '"'), trimChar(columns[1], '"').split(";").join(",").split(".").join(",").split(",,").join(","), "[" + trimChar(columns[3], '"') + "]", trimChar(columns[5], '"'));
                        allwords.push(newWord);
                    }
                }
                wordContent = null;

            }
        }

        function ReadyRun() {
            document.getElementById("DarkThemeCheckbox").checked = darkThemeModeActive();
            setTheme();

            function GetResultsFromHistory() {
                var historyEnWordsArray = [];

                try {
                    var history = localStorage.getItem("history");
                    var historyNew = "";
                    if (history) {
                        history = history.split('|||');

                        var now = new Date();
                        var result = "";
                        for (var i = 0; i < history.length; i++) {
                            if (history[i]) {
                                var historyRow = history[i].split('===');
                                if (historyRow.length == 2) {
                                    var word = historyRow[0];
                                    if (word.indexOf("[") != -1) {
                                        word = word.substring(0, word.indexOf("["));
                                    }
                                    var date = new Date(historyRow[1]);
                                    date.setTime(date.getTime() + showHistoryForDays() * 86400000);
                                    var date2 = new Date(historyRow[1]);
                                    date2.setTime(date2.getTime() + saveHistoryForDays() * 86400000);
                                    if (date >= now) {
                                        historyEnWordsArray.push(new DictionaryWord(word, historyRow[1], ""));
                                    }
                                    if (date2 >= now) {
                                        historyNew = historyNew + "|||" + word + "===" + historyRow[1];
                                    }
                                }
                            }
                        }
                        localStorage.setItem("history", historyNew);

                        ///=======removing duplicates
                        historyEnWordsArray = historyEnWordsArray.sortBy(function (o) { return o.word });
                        // delete all duplicates from the array
                        for (var i = 0; i < historyEnWordsArray.length - 1; i++) {
                            if (historyEnWordsArray[i].word == historyEnWordsArray[i + 1].word) {
                                delete historyEnWordsArray[i];
                            }
                        }
                        // remove the "undefined entries"
                        historyEnWordsArray = historyEnWordsArray.filter(function (el) { return (typeof el !== "undefined"); });
                        ///=======removing duplicates end
                    }
                }
                catch (err) {

                }

                if (orderHistoryByDateModeActive()) {
                    return historyEnWordsArray.sortBy(function (o) { return new Date(o.translation) }).reverse();
                } else {
                    return historyEnWordsArray.sortBy(function (o) { return o.word });
                }
            }

            function pushResultToHistory(word) {
                if (!historyModeActive()) {
                    try {
                        var text = word;
                        if (word == null) {
                            var enText = document.querySelector("#SearchResults tr > td.transcription").innerText
                            text = enText;
                        }

                        var history = localStorage.getItem("history");
                        if (!history) {
                            history = "";
                        }
                        history = history + "|||" + text + "===" + new Date().toUTCString();

                        localStorage.setItem("history", history);

                    }
                    catch (err) {

                    }
                }
            }


            var searchResultsClickLinterner = function (e) {
                var tr = e.target.parentElement;
                if (tr.localName == "tr") {
                    var trDiv = tr.querySelector("." + transcriptionTextClass);
                    trDiv.style.display = 'block';
                    playSound(trDiv);

                    function removeHover() {
                        var elemets = document.querySelectorAll("#SearchResults tr." + hoverClass);
                        if (elemets.length > 0) {
                            for (var i = 0; i < elemets.length; i++) {
                                elemets[i].classList.remove(hoverClass);
                            }
                        }
                    }

                    if (tr.classList.contains(hoverClass)) {
                        removeHover();
                    } else {
                        removeHover();
                        var enword = trim(tr.querySelector("." + transcriptionClass).innerText.replace(tr.querySelector("." + transcriptionTextClass).innerText, ""));
                        pushResultToHistory(enword);
                        tr.classList.add(hoverClass);
                    }
                }
            };
            document.getElementById("SearchResults").addEventListener("click", searchResultsClickLinterner);

            document.getElementById("ShowHistoryForDays").value = showHistoryForDays();
            document.getElementById("SaveHistoryForDays").value = saveHistoryForDays();

            var showHistoryClickLinterner = function (e) {
                document.getElementById("ShowHistory").focus();
                pushResultToHistory();
                getTranslations("", true, true);
            };
            document.getElementById("ShowHistory").addEventListener("click", showHistoryClickLinterner);

            var orderHistoryByDateClickLinterner = function (e) {
                getTranslations("", true, true);
            };
            document.getElementById("OrderHistoryByDate").addEventListener("click", orderHistoryByDateClickLinterner);

            function setTheme() {
                if (!document.getElementsByTagName("body")[0].className) {
                    document.getElementsByTagName("body")[0].className = " ";
                }
                var arrayLength = 0;
                if (document.getElementById("DarkThemeCheckbox").checked) {
                    localStorage.setItem("darkTheme", true);
                    if (!document.getElementsByTagName("body")[0].className.match(/(?:^|\s)dark(?!\S)/)) {
                        document.getElementById("SearchForm").className += " dark";
                        document.getElementById("SearchResults").className += " dark";
                        document.getElementsByTagName("body")[0].className += " dark";

                        arrayLength = document.getElementsByClassName("clear").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("clear")[i].className += " dark";
                        }

                        arrayLength = document.getElementsByClassName("history").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("history")[i].className += " dark";
                        }

                        arrayLength = document.getElementsByClassName("translate").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("translate")[i].className += " dark";
                        }
                    }
                } else {
                    localStorage.setItem("darkTheme", false);
                    if (document.getElementsByTagName("body")[0].className.match(/(?:^|\s)dark(?!\S)/)) {
                        document.getElementById("SearchForm").className = document.getElementById("SearchForm").className.replace(/(?:^|\s)dark(?!\S)/g, '');
                        document.getElementById("SearchResults").className = document.getElementById("SearchResults").className.replace(/(?:^|\s)dark(?!\S)/g, '');
                        document.getElementsByTagName("body")[0].className = document.getElementsByTagName("body")[0].className.replace(/(?:^|\s)dark(?!\S)/g, '');

                        arrayLength = document.getElementsByClassName("clear").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("clear")[i].className = document.getElementsByClassName("clear")[i].className.replace(/(?:^|\s)dark(?!\S)/g, '');
                        }

                        arrayLength = document.getElementsByClassName("history").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("history")[i].className = document.getElementsByClassName("history")[i].className.replace(/(?:^|\s)dark(?!\S)/g, '');
                        }

                        arrayLength = document.getElementsByClassName("translate").length || 0;
                        for (var i = 0; i < arrayLength; i++) {
                            document.getElementsByClassName("translate")[i].className = document.getElementsByClassName("translate")[i].className.replace(/(?:^|\s)dark(?!\S)/g, '');
                        }
                    }
                }
            }
            var darkThemeCheckboxClickLinterner = function (e) {
                setTheme();
            };
            document.getElementById("DarkThemeCheckbox").addEventListener("click", darkThemeCheckboxClickLinterner);

            var settingsContainerCloseClickLinterner = function (e) {
                if (historyModeActive()) {
                    getTranslations("", true, true);
                }
                document.getElementById("SettingsContainer").style.display = "none";
            };
            document.getElementById("SettingsContainerClose").addEventListener("click", settingsContainerCloseClickLinterner);

            var ShowSettingsClickLinterner = function (e) {
                document.getElementById("ShowSettings").focus();
                document.getElementById("SettingsContainer").style.display = "block";
                document.getElementById("HistoryRawValue").value = localStorage.getItem("history");
            };
            document.getElementById("ShowSettings").addEventListener("click", ShowSettingsClickLinterner);

            var historyRawValueFocusOutLinterner = function (e) {
                var newValue = document.getElementById("HistoryRawValue").value;
                if (newValue && newValue > 0) {
                    localStorage.setItem("history", newValue);
                }
            };
            document.getElementById("HistoryRawValue").addEventListener("focusout", historyRawValueFocusOutLinterner);


            var saveHistoryForDaysFocusOutLinterner = function (e) {
                var newValue = document.getElementById("SaveHistoryForDays").value;
                if (newValue && newValue > 0) {
                    localStorage.setItem("SaveHistoryForDays", newValue);
                }
            };
            document.getElementById("SaveHistoryForDays").addEventListener("focusout", saveHistoryForDaysFocusOutLinterner);

            var showHistoryForDaysFocusOutLinterner = function (e) {
                var newValue = document.getElementById("ShowHistoryForDays").value;
                if (newValue && newValue > 0) {
                    localStorage.setItem("ShowHistoryForDays", newValue);
                }
            };
            document.getElementById("ShowHistoryForDays").addEventListener("focusout", showHistoryForDaysFocusOutLinterner);

            var clearbuttons = document.getElementsByClassName("clear");
            for (var i = 0; i < clearbuttons.length; i++) {
                clearbuttons[i].addEventListener('click', function (e) {
                    pushResultToHistory();
                    var focus1else2 = false;
                    if (e.target.dataset["id"] == "Translate") {
                        focus1else2 = true;
                    }
                    if (e.target.dataset["id"] == "Translate2") {
                        focus1else2 = false;
                    }

                    document.getElementById("Translate").value = '';
                    document.getElementById("Translate2").value = '';

                    if (focus1else2) {
                        document.getElementById("Translate").focus();
                    } else {
                        document.getElementById("Translate2").focus();
                    }
                    getTranslations("", focus1else2, true);
                });
            }


            function TranslateChange(e) {
                var word = document.getElementById("Translate").value;
                var pasteMode = false;
                if (e.type == "paste" && e.clipboardData) {
                    word = e.clipboardData.getData('Text');
                    pasteMode = true;
                }
                if (getTranslations(word, true, false)) {
                    document.getElementById("Translate2").value = '';
                    document.getElementById("Translate").focus();
                    if (pasteMode) {
                        pushResultToHistory();
                    }
                }
            }
            document.getElementById("Translate").addEventListener('paste', TranslateChange);
            document.getElementById("Translate").addEventListener('keyup', TranslateChange);

            function Translate2Change(e) {
                var word = document.getElementById("Translate2").value;
                var pasteMode = false;
                if (e.type == "paste" && e.clipboardData) {
                    word = e.clipboardData.getData('Text');
                    pasteMode = true;
                }
                if (getTranslations(word, false, false)) {
                    document.getElementById("Translate").value = '';
                    document.getElementById("Translate2").focus();
                    if (pasteMode) {
                        pushResultToHistory();
                    }
                }
            }
            document.getElementById("Translate2").addEventListener('paste', Translate2Change);
            document.getElementById("Translate2").addEventListener('keyup', Translate2Change);

            loadAllWords();

            function getTranslations(word, fromLeftElseRight, historyMode) {
                location.hash = '#' + word;
                if (historyMode) {
                    document.getElementById("ShowHistory").style.color = "Red";
                } else {
                    document.getElementById("ShowHistory").style.color = "";
                }
                word = trim(word);
                if ((word != '' && word.length > 1) || historyMode) {
                    word = word.toLowerCase();
                    var english = /^[A-Za-z0-9 -]*$/;
                    var isEnglish = false;
                    if (english.test(word)) {
                        isEnglish = true;
                    }

                    if (allwords.length == 0) {
                        loadAllWords();
                    }

                    var dictWord;
                    var wordTranslations = [];
                    var startsWithWord = [];
                    var containsWord = [];
                    var startsWith = [];
                    var contains = [];
                    var historyEnWordsArray;
                    if (!historyMode) {
                        for (var i = 0; i < allwords.length; i++) {
                            dictWord = allwords[i];
                            if (dictWord.containsExact(word)) {
                                wordTranslations.push(dictWord);
                            } else if (dictWord.startsWithWord(word)) {
                                startsWithWord.push(dictWord);
                            } else if (dictWord.containsWord(word)) {
                                containsWord.push(dictWord);
                            } else if (dictWord.startsWith(word)) {
                                startsWith.push(dictWord);
                            } else if (dictWord.contains(word)) {
                                contains.push(dictWord);
                            }
                        }
                        wordTranslations = wordTranslations.concat(startsWithWord);
                        wordTranslations = wordTranslations.concat(containsWord);
                        wordTranslations = wordTranslations.concat(startsWith);
                        wordTranslations = wordTranslations.concat(contains);

                    } else {
                        historyEnWordsArray = GetResultsFromHistory();
                        for (var y = 0; y < historyEnWordsArray.length; y++) {
                            for (var i = 0; i < allwords.length; i++) {
                                dictWord = allwords[i];
                                if (dictWord.containsExact(historyEnWordsArray[y].word)) {
                                    wordTranslations.push(dictWord);
                                }
                            }
                        }
                    }


                    var resultsContent = "";
                    var tempDate = new Date();
                    var prevDate = new Date(tempDate.getFullYear() - 1, tempDate.getMonth(), tempDate.getDate());//,tempDate.getHours(),tempDate.getMinutes());

                    var translationUnderWord = false;
                    if (document.getElementById("TranslationUnderWord").checked) {
                        translationUnderWord = true;
                    }

                    for (var i = 0; i < wordTranslations.length; i++) {
                        dictWord = wordTranslations[i];
                        var columnTranscription = "<div class='" + transcriptionTextClass + "' data-mp3='" + dictWord.mp3Url + "' style='display:none;'>" + dictWord.transcription + "</div>";

                        var translationContent = "";
                        var wordContent = "";
                        if (historyMode) {
                            wordContent = dictWord.word;
                            translationContent = dictWord.translation;
                        } else {
                            wordContent = dictWord.word.replace(word, "<b>" + word + "</b>");
                            var translationWordsWrapped = [];
                            for (var v = 0; v < dictWord.translationWords.length; v++) {
                                var value = dictWord.translationWords[v];
                                translationWordsWrapped.push("<span class='translationWord'>" + value.replace(word, "<b>" + word + "</b>") + "</span>");
                            }
                            translationContent = translationWordsWrapped.join(", ");
                        }

                        //column1Word
                        var column1 = wordContent;
                        var column2 = translationContent;
                        var column1class = transcriptionClass;
                        var column2class = "";
                        var column1Transcription = columnTranscription;
                        var column2Transcription = "";

                        function column2Word() {
                            column1 = translationContent;
                            column2 = wordContent;
                            column1class = "";
                            column2class = transcriptionClass;
                            column1Transcription = "";
                            column2Transcription = columnTranscription;
                        }

                        if (fromLeftElseRight) {
                            if (translationUnderWord) {
                                if (isEnglish) {
                                    column2Word();
                                }
                            } else {
                                if (!isEnglish) {
                                    column2Word();
                                }
                            }
                        } else {
                            if (translationUnderWord) {
                                if (!isEnglish) {
                                    column2Word();
                                }
                            } else {
                                if (isEnglish) {
                                    column2Word();
                                }
                            }

                        }

                        var trClass = "";
                        if (dictWord.containsExact(word)) {
                            trClass = exactClass;
                        }

                        var trContent = "<tr class='" + trClass + "'><td class='" + column1class + "'>" + column1 + column1Transcription + "</td><td class='" + column2class + "'>" + column2 + column2Transcription + "</td></tr>";

                        var trDate = "";
                        if (historyMode && orderHistoryByDateModeActive()) {
                            var curDateDictWord = null;
                            for (var y = 0; y < historyEnWordsArray.length; y++) {
                                if (dictWord.containsExact(historyEnWordsArray[y].word)) {
                                    curDateDictWord = historyEnWordsArray[y];
                                    break;
                                }
                            }
                            if (curDateDictWord != null) {
                                var date = new Date(curDateDictWord.translation);
                                var testDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());//,date.getHours(),date.getMinutes());
                                if (prevDate.toUTCString() != testDate.toUTCString()) {
                                    prevDate = testDate;
                                    var testDateString = testDate.getFullYear() + "-" + (testDate.getMonth() + 1) + "-" + testDate.getDate();// + "-" + testDate.getHours() + "-" + testDate.getMinutes());
                                    trDate = "<tr class='" + trClass + "'><td class='" + column1class + "'><b>" + testDateString + "<b/></td><td class='" + column2class + "'>" + "" + "</td></tr>";
                                }
                            }
                        }
                        resultsContent += trDate + trContent;
                    };
                    document.getElementById("SearchResults").innerHTML = "<tbody>" + resultsContent + "</tbody>";

                    return true;
                }

                return false;
            };

            var activeHashWord = "";
            if (location.hash && location.hash != "#") {
                activeHashWord = location.hash.replace("#", "");
            }

            if (activeHashWord != '') {
                document.getElementById("Translate2").value = activeHashWord;
                if (getTranslations(activeHashWord, false, false)) {
                    document.getElementById("Translate").value = '';
                    document.getElementById("Translate2").focus();
                }
            } else {
                if (getTranslations("", false, true)) {
                    document.getElementById("Translate").value = '';
                    document.getElementById("Translate2").value = '';
                    document.getElementById("Translate2").focus();
                }
            }
        };

        ReadyRun();

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();