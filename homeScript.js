document.addEventListener('DOMContentLoaded', () => {

    //create arrays for constants within the image carousel containter 
    //holds text content in the image carousel and separate URL links for each graph page
    const graphTitles = ['GRAPH 1', 'GRAPH 2', 'GRAPH 3'];
    const graphSubtitles = ['Global View', 'Australian View', 'placeholder text'];
    const graphImages = ['graph1.jpg', 'graph2.jpg', 'graph3.jpg'];
    const graphPages = ['graph1.html', 'graph2.html', 'graph3.html'];
    //initialise the carousel container which is displayed upon loading
    let imgCarousel = 0; //0 displays preview info for graph 1

    //set elements which will be used to update title, subtitle, and image within the carousel
    const titleElement = document.getElementById('graphTitle');
    const subtitleElement = document.getElementById('graphSubtitle');
    const imageElement = document.getElementById('graphImage');
    const playBtnElement = document.getElementById('playBtn');
    const viewBtnElement = document.getElementById("viewBtn");

    //A function to update the content of the image carousel
    function updateImgCarousel() {
        titleElement.textContent = graphTitles[imgCarousel];
        subtitleElement.textContent = graphSubtitles[imgCarousel];
        imageElement.src = graphImages[imgCarousel];
    }
    
    // Function to navigate to a specific graph page
    function navigateToGraph(graphNumber) {
        window.location.href = graphPages[graphNumber];
    }

    //set event lister for the 'play' button
    playBtnElement.addEventListener('click', () => {
        imgCarousel = (imgCarousel + 1) % graphTitles.length; //increments imgCarousel index, modulus ensures index loops back to zero when reaching the end of the array
        updateImgCarousel(); //function called to refresh image carousel display
    });

    // Set event listener for the 'view' button
    viewBtnElement.addEventListener('click', () => {
        navigateToGraph(imgCarousel); // Navigate to the page corresponding to the current carousel image
    });

    // Set up button clicks for nav bar
    document.getElementById('homeBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });

    document.getElementById('abtBtn').addEventListener('click', () => {
        window.location.href = 'aboutUs.html';
    });

    updateImgCarousel();
    
});