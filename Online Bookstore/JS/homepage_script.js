document.addEventListener('DOMContentLoaded', () => {

     /* Dropdown menu functionality */
     const dropdowns = document.querySelectorAll('.dropdown');

     dropdowns.forEach(dropdown => {
         const dropdownContent = dropdown.querySelector('.dropdown-content');
         
         dropdown.addEventListener('mouseenter', () => {
             dropdownContent.style.display = 'block';
         });
 
         dropdown.addEventListener('mouseleave', () => {
             dropdownContent.style.display = 'none';
         });
     });

     /* Book Slider functionality */
    const bookSliders = document.querySelectorAll('.book-slider');
    
    bookSliders.forEach(slider => {
        const bookGrid = slider.querySelector('.book-grid');
        const scrollAmount = 200;
        
        slider.addEventListener('wheel', (e) => {
            e.preventDefault();
            slider.scrollLeft += e.deltaY;
        });

        const leftArrow = document.createElement('button');
        leftArrow.innerHTML = '&larr;';
        leftArrow.classList.add('slider-arrow', 'left-arrow');
        
        const rightArrow = document.createElement('button');
        rightArrow.innerHTML = '&rarr;';
        rightArrow.classList.add('slider-arrow', 'right-arrow');
        
        slider.parentNode.insertBefore(leftArrow, slider);
        slider.parentNode.insertBefore(rightArrow, slider.nextSibling);
        
        function wrapScroll(direction) {
            const currentScroll = slider.scrollLeft;
            const maxScroll = slider.scrollWidth - slider.clientWidth;
        
            // Add a small tolerance to account for imprecisions
            const tolerance = 2;
        
            if (direction === 'left') {
                if (currentScroll <= 0 + tolerance) {
                    slider.scrollTo({ left: maxScroll, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
                }
            } else {
                if (currentScroll >= maxScroll - tolerance) {
                    slider.scrollTo({ left: 0, behavior: 'smooth' });
                } else {
                    slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
                }
            }
        }
        
        
        leftArrow.addEventListener('click', () => wrapScroll('left'));
        rightArrow.addEventListener('click', () => wrapScroll('right'));
    });
});