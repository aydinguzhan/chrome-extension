document.addEventListener('DOMContentLoaded', function () {
    let btn = document.getElementById("btn");
    let remove = document.getElementById("remove");
    let back = document.getElementById("back");
    let title = document.getElementById("title");
    var count = 0;

    // routing google
    const routing = () => {
        chrome.tabs.create({ url: `http://www.google.com` });
    }


    //All tabs are closed (removed)
    const removTabs = () => {
        chrome.tabs.query({}, function (tabs) {
                for (var i = 0; i < tabs.length; i++) {
                    chrome.tabs.remove(tabs[i].id);       
            }
        });

    }
   
    function process_bookmark(bookmarks) {

        for (var i = 0; i < bookmarks.length; i++) {
            var bookmark = bookmarks[i];
            if (bookmark.title === "hiddenapp") {
                chrome.tabs.create({ url: `${bookmark.url}` })
            }

            if (bookmark.children) {
                process_bookmark(bookmark.children);
            }
        }
    }


    // create otherbookmarks>newfolder (saved) 
    var tabsSave = () => {
        chrome.bookmarks.create({
            'title': 'Extension bookmarks'
        },
            function newFolderCreate(newFolder) {
                createBookmark(newFolder.id);

            });
        function createBookmark(extensionsFolderId) {
            chrome.windows.getAll({ populate: true }, (windows) => {
                windows.forEach(function (window) {
                    window.tabs.forEach(function (tab) {
                        chrome.bookmarks.create({
                            "parentId": extensionsFolderId,
                            "title": "hiddenapp",
                            "url": `${tab.url}`
                        });
                    });
                });

            })

        }
        
    }

 // All tabs deleted for bookmarks>otherbookmarks
    function deletedBookmarks() {
        printBookmarks('2');

        function printBookmarks(id) {
            chrome.bookmarks.getChildren(id, function (children) {
                children.forEach(function (bookmark) {
                    chrome.bookmarks.removeTree(`${bookmark.id}`);
                    printBookmarks(bookmark.id);
                });
            });
        }
    }

    // ---------------------------Oncliks events---------------------------------
   

    //Hidden  button  onclick
    btn.addEventListener('click', function () {
        tabsSave();
        
        
       
    })

    // Back tabs bookmarks 
    back.addEventListener('click', () => {
        chrome.bookmarks.getTree(process_bookmark)
        deletedBookmarks();
    })

    //Remov all tabs and routing
    remove.addEventListener('click', () => {
        removTabs();
        chrome.tabs.create({ url: `http://www.google.com` });

    })

})

