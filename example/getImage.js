const EPub = require("../epub");

const epub = new EPub("metropolis.epub");
epub.on("error", function(err){
    console.log("ERROR\n-----");
    throw err;
});

epub.on("end", function(err){
    if (err) {
        console.log(err);
        return;
    }

    // Log metadata
    // console.log("METADATA:\n", epub.metadata);

    // Log spine
    console.log("\nSPINE:\n", epub.flow);

    // Log TOC
    // console.log("\nTOC:\n", epub.toc);

    // Get the first chapter
    epub.getChapterRaw(epub.flow[0].id, function(err, data){
        if(err){
            console.log(err);
            return;
        }
        console.log("\nCONTENT CHAPTER:\n");
        console.log(data.substr(0,10000)+"..."); // first 10,000 bytes
    });

    // List all manifest items to debug the correct path
    console.log("\nMANIFEST ITEMS:\n", epub.manifest);

    // Find the specific image by href
    const manifestKeys = Object.keys(epub.manifest);
    const imageItem = manifestKeys.find(key => epub.manifest[key].href.includes("8560903303369028308_cover.jpg"));
    
    if (imageItem) {
        console.log("Found image item:", epub.manifest[imageItem]);
        epub.getImage(imageItem, function(err, data, mimeType){
            if (err) {
                console.log("Error fetching the image:", err);
                return;
            }
            console.log("\nIMAGE CONTENT:\n", data);
            console.log("MIME TYPE:", mimeType);
        });
    } else {
        console.log("Image file not found in manifest items.");
    }
});

epub.parse();
