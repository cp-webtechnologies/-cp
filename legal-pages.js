// Legal Pages JavaScript Functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Table of Contents functionality
    initTableOfContents();
    
    // Smooth scrolling for TOC links
    initSmoothScrolling();
    
    // Section highlighting on scroll
    initScrollSpy();
    
    // Print functionality
    initPrintFeatures();
    
    // Accessibility enhancements
    initAccessibilityFeatures();
    
    // Search functionality within the page
    initPageSearch();
});

// Initialize Table of Contents functionality
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.legal-section');
    
    // Add click handlers to TOC links
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Remove active class from all links
                tocLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to clicked link
                this.classList.add('active');
                
                // Scroll to section with offset for fixed navbar
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Highlight the section briefly
                targetSection.classList.add('highlighted');
                setTimeout(() => {
                    targetSection.classList.remove('highlighted');
                }, 2000);
            }
        });
    });
}

// Initialize smooth scrolling for all anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = target.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Initialize scroll spy for TOC highlighting
function initScrollSpy() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    const sections = document.querySelectorAll('.legal-section');
    
    function updateActiveLink() {
        const scrollPosition = window.scrollY + window.innerHeight / 3;
        
        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });
        
        // Update TOC active state
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (activeSection) {
                const targetId = activeSection.getAttribute('id');
                const correspondingLink = document.querySelector(`.toc-list a[href="#${targetId}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        });
    }
    
    // Throttled scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveLink, 10);
    });
    
    // Initial call
    updateActiveLink();
}

// Initialize print functionality
function initPrintFeatures() {
    // Add print button if needed
    const printButton = document.createElement('button');
    printButton.innerHTML = '<i class="fas fa-print"></i> Print Page';
    printButton.className = 'btn btn-secondary print-btn';
    printButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        display: none;
        padding: 10px 15px;
        background: #667eea;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
    `;
    
    printButton.addEventListener('click', function() {
        window.print();
    });
    
    document.body.appendChild(printButton);
    
    // Show print button on larger screens
    if (window.innerWidth > 768) {
        printButton.style.display = 'block';
    }
    
    // Handle print events
    window.addEventListener('beforeprint', function() {
        document.body.classList.add('printing');
    });
    
    window.addEventListener('afterprint', function() {
        document.body.classList.remove('printing');
    });
}

// Initialize accessibility features
function initAccessibilityFeatures() {
    // Add skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #2c5aa0;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 0 0 4px 4px;
        z-index: 1001;
        transition: top 0.3s;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '0';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Add main content ID if not exists
    const legalMain = document.querySelector('.legal-main');
    if (legalMain && !legalMain.id) {
        legalMain.id = 'main-content';
    }
    
    // Enhance keyboard navigation
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Add focus indicators
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #667eea';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
}

// Initialize page search functionality
function initPageSearch() {
    // Create search container
    const searchContainer = document.createElement('div');
    searchContainer.className = 'page-search';
    searchContainer.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 1000;
        display: none;
        min-width: 250px;
    `;
    
    searchContainer.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
            <input type="text" placeholder="Search this page..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <button class="close-search" style="background: none; border: none; font-size: 18px; cursor: pointer;">&times;</button>
        </div>
        <div class="search-results" style="max-height: 200px; overflow-y: auto;"></div>
    `;
    
    document.body.appendChild(searchContainer);
    
    // Add search trigger (Ctrl+F or Cmd+F)
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            togglePageSearch();
        }
        
        if (e.key === 'Escape') {
            hidePageSearch();
        }
    });
    
    // Search functionality
    const searchInput = searchContainer.querySelector('input');
    const searchResults = searchContainer.querySelector('.search-results');
    const closeButton = searchContainer.querySelector('.close-search');
    
    searchInput.addEventListener('input', function() {
        performSearch(this.value);
    });
    
    closeButton.addEventListener('click', hidePageSearch);
    
    function togglePageSearch() {
        if (searchContainer.style.display === 'none') {
            searchContainer.style.display = 'block';
            searchInput.focus();
        } else {
            hidePageSearch();
        }
    }
    
    function hidePageSearch() {
        searchContainer.style.display = 'none';
        clearSearchHighlights();
    }
    
    function performSearch(query) {
        clearSearchHighlights();
        searchResults.innerHTML = '';
        
        if (query.length < 2) return;
        
        const sections = document.querySelectorAll('.legal-section');
        const results = [];
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            const queryLower = query.toLowerCase();
            
            if (text.includes(queryLower)) {
                const title = section.querySelector('h2').textContent;
                const snippet = extractSnippet(section.textContent, query);
                
                results.push({
                    title: title,
                    snippet: snippet,
                    element: section
                });
                
                // Highlight matches in the section
                highlightMatches(section, query);
            }
        });
        
        displaySearchResults(results);
    }
    
    function extractSnippet(text, query) {
        const index = text.toLowerCase().indexOf(query.toLowerCase());
        const start = Math.max(0, index - 50);
        const end = Math.min(text.length, index + query.length + 50);
        return '...' + text.substring(start, end) + '...';
    }
    
    function highlightMatches(element, query) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const textNodes = [];
        let node;
        
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }
        
        textNodes.forEach(textNode => {
            const text = textNode.textContent;
            const regex = new RegExp(`(${query})`, 'gi');
            
            if (regex.test(text)) {
                const highlightedText = text.replace(regex, '<mark style="background: yellow; padding: 2px;">$1</mark>');
                const wrapper = document.createElement('span');
                wrapper.innerHTML = highlightedText;
                textNode.parentNode.replaceChild(wrapper, textNode);
            }
        });
    }
    
    function clearSearchHighlights() {
        const highlights = document.querySelectorAll('mark');
        highlights.forEach(mark => {
            const parent = mark.parentNode;
            parent.replaceChild(document.createTextNode(mark.textContent), mark);
            parent.normalize();
        });
    }
    
    function displaySearchResults(results) {
        if (results.length === 0) {
            searchResults.innerHTML = '<p style="color: #666; font-style: italic;">No results found</p>';
            return;
        }
        
        const resultsList = document.createElement('ul');
        resultsList.style.cssText = 'list-style: none; padding: 0; margin: 0;';
        
        results.forEach(result => {
            const listItem = document.createElement('li');
            listItem.style.cssText = 'margin-bottom: 10px; padding: 8px; border-radius: 4px; cursor: pointer; border: 1px solid #eee;';
            
            listItem.innerHTML = `
                <strong style="color: #2c5aa0;">${result.title}</strong><br>
                <small style="color: #666;">${result.snippet}</small>
            `;
            
            listItem.addEventListener('click', function() {
                result.element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                hidePageSearch();
            });
            
            listItem.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f4ff';
            });
            
            listItem.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
            });
            
            resultsList.appendChild(listItem);
        });
        
        searchResults.appendChild(resultsList);
    }
}

// Utility function to debounce scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add reading progress indicator
function initReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 70px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #2c5aa0);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    const updateProgress = debounce(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = Math.min(100, Math.max(0, scrollPercent)) + '%';
    }, 10);
    
    window.addEventListener('scroll', updateProgress);
    updateProgress(); // Initial call
}

// Initialize reading progress on load
document.addEventListener('DOMContentLoaded', function() {
    initReadingProgress();
});

// Add copy section link functionality
function initCopySectionLinks() {
    const sections = document.querySelectorAll('.legal-section');
    
    sections.forEach(section => {
        const heading = section.querySelector('h2');
        if (heading) {
            const copyButton = document.createElement('button');
            copyButton.innerHTML = '<i class="fas fa-link"></i>';
            copyButton.className = 'copy-link-btn';
            copyButton.title = 'Copy link to this section';
            copyButton.style.cssText = `
                background: none;
                border: none;
                color: #667eea;
                font-size: 0.9rem;
                margin-left: 10px;
                cursor: pointer;
                opacity: 0;
                transition: opacity 0.3s;
                padding: 5px;
                border-radius: 3px;
            `;
            
            copyButton.addEventListener('click', function() {
                const sectionId = section.getAttribute('id');
                const url = window.location.origin + window.location.pathname + '#' + sectionId;
                
                navigator.clipboard.writeText(url).then(() => {
                    copyButton.innerHTML = '<i class="fas fa-check"></i>';
                    copyButton.style.color = '#4caf50';
                    
                    setTimeout(() => {
                        copyButton.innerHTML = '<i class="fas fa-link"></i>';
                        copyButton.style.color = '#667eea';
                    }, 2000);
                });
            });
            
            heading.appendChild(copyButton);
            
            // Show/hide on hover
            section.addEventListener('mouseenter', function() {
                copyButton.style.opacity = '1';
            });
            
            section.addEventListener('mouseleave', function() {
                copyButton.style.opacity = '0';
            });
        }
    });
}

// Initialize copy section links
document.addEventListener('DOMContentLoaded', function() {
    initCopySectionLinks();
});

// Add responsive TOC toggle for mobile
function initMobileTOC() {
    if (window.innerWidth <= 768) {
        const tocSidebar = document.querySelector('.toc-sidebar');
        if (tocSidebar) {
            const toggleButton = document.createElement('button');
            toggleButton.innerHTML = '<i class="fas fa-list"></i> Table of Contents';
            toggleButton.className = 'toc-toggle-btn';
            toggleButton.style.cssText = `
                width: 100%;
                padding: 15px;
                background: #667eea;
                color: white;
                border: none;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
                margin-bottom: 20px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            `;
            
            const tocContent = tocSidebar.innerHTML;
            tocSidebar.innerHTML = '';
            tocSidebar.appendChild(toggleButton);
            
            const tocContentDiv = document.createElement('div');
            tocContentDiv.innerHTML = tocContent;
            tocContentDiv.style.display = 'none';
            tocSidebar.appendChild(tocContentDiv);
            
            toggleButton.addEventListener('click', function() {
                const isVisible = tocContentDiv.style.display !== 'none';
                tocContentDiv.style.display = isVisible ? 'none' : 'block';
                toggleButton.innerHTML = isVisible 
                    ? '<i class="fas fa-list"></i> Table of Contents'
                    : '<i class="fas fa-times"></i> Hide Contents';
            });
        }
    }
}

// Initialize mobile TOC
document.addEventListener('DOMContentLoaded', function() {
    initMobileTOC();
});