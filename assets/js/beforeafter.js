class BeforeAfter {
    constructor(enteryObject) {
        const beforeAfterContainer = document.querySelector(enteryObject.id);
        if (!beforeAfterContainer) {
            return;
        }
        
        const before = beforeAfterContainer.querySelector(".bal-before");
        const beforeText = beforeAfterContainer.querySelector(".bal-beforePosition");
        const afterText = beforeAfterContainer.querySelector(".bal-afterPosition");
        const handle = beforeAfterContainer.querySelector(".bal-handle");
        let isDragging = false;
        let isHandleDrag = false;
        
        beforeAfterContainer.querySelector(".bal-before-inset").setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;");
        
        window.onresize = function() {
            beforeAfterContainer.querySelector(".bal-before-inset").setAttribute("style", "width: " + beforeAfterContainer.offsetWidth + "px;");
        };
        
        before.setAttribute("style", "width: 50%;");
        handle.setAttribute("style", "left: 50%;");
        
        // Touch events (unchanged)
        beforeAfterContainer.addEventListener("touchstart", (e) => {
            beforeAfterContainer.addEventListener("touchmove", (e2) => {
                let containerWidth = beforeAfterContainer.offsetWidth;
                let currentPoint = e2.changedTouches[0].clientX;
                let startOfDiv = beforeAfterContainer.offsetLeft;
                let modifiedCurrentPoint = currentPoint - startOfDiv;
                
                if (modifiedCurrentPoint > 10 && modifiedCurrentPoint < beforeAfterContainer.offsetWidth - 10) {
                    let newWidth = (modifiedCurrentPoint * 100) / containerWidth;
                    before.setAttribute("style", "width:" + newWidth + "%;");
                    afterText.setAttribute("style", "z-index: 1;");
                    handle.setAttribute("style", "left:" + newWidth + "%;");
                }
            });
        });
        
        // Handle-specific mouse down event
        handle.addEventListener("mousedown", (e) => {
            e.stopPropagation(); // Prevent container mousedown
            isDragging = true;
            isHandleDrag = true;
        });
        
        // Container mouse down event (for clicking anywhere else)
        beforeAfterContainer.addEventListener("mousedown", (e) => {
            if (!isHandleDrag) {
                isDragging = true;
                updateSlider(e);
            }
        });
        
        // Mouse move event (works when dragging)
        document.addEventListener("mousemove", (e) => {
            if (isDragging && isHandleDrag) {
                // Calculate position relative to container
                let containerRect = beforeAfterContainer.getBoundingClientRect();
                let relativeX = e.clientX - containerRect.left;
                
                let containerWidth = beforeAfterContainer.offsetWidth;
                let newWidth = (relativeX * 100) / containerWidth;
                
                if (relativeX > 10 && relativeX < containerWidth - 10) {
                    before.setAttribute("style", "width:" + newWidth + "%;");
                    afterText.setAttribute("style", "z-index: 1;");
                    handle.setAttribute("style", "left:" + newWidth + "%;");
                }
            }
        });
        
        // Container mouse move event (for non-handle dragging)
        beforeAfterContainer.addEventListener("mousemove", (e) => {
            if (isDragging && !isHandleDrag) {
                updateSlider(e);
            }
        });
        
        // Mouse up event to stop dragging
        document.addEventListener("mouseup", () => {
            isDragging = false;
            isHandleDrag = false;
        });
        
        // Function to update slider position
        function updateSlider(e) {
            let containerWidth = beforeAfterContainer.offsetWidth;
            let widthChange = e.offsetX;
            let newWidth = (widthChange * 100) / containerWidth;
            
            if (e.offsetX > 10 && e.offsetX < containerWidth - 10) {
                before.setAttribute("style", "width:" + newWidth + "%;");
                afterText.setAttribute("style", "z-index: 1;");
                handle.setAttribute("style", "left:" + newWidth + "%;");
            }
        }
    }
}

new BeforeAfter({
    id: "#one"
});
