document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');
    const navLinks = document.querySelector('.nav-links');
    const menuButton = document.querySelector('.menu-button');

    // Mobile menu toggle
    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Animate elements on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                animationObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        animationObserver.observe(el);
    });

    // Scroll spy for navigation links
    const sections = document.querySelectorAll('section');
    const navLinksAnchors = document.querySelectorAll('.nav-links a');

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                history.pushState(null, null, `#${id}`);
                
                navLinksAnchors.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, { rootMargin: '-50% 0px -50% 0px' });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // Contact form submission
    const contactForm = document.querySelector('.contact-form form');
    const submitButton = document.querySelector('.contact-form .btn');
    const toaster = document.getElementById('toaster');

    const validateForm = () => {
        let isValid = true;
        const requiredFields = contactForm.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.border = '1px solid red';
            } else {
                field.style.border = '1px solid #ddd';
            }
        });

        if (!isValid) {
            showToaster('Please fill out all required fields.', 'error');
        }

        return isValid;
    };

    const handleFormSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch('https://formspree.io/f/your@email.com', {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showToaster('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                const responseData = await response.json();
                const errorMessage = responseData.error || 'An error occurred. Please try again.';
                showToaster(errorMessage, 'error');
            }
        } catch (error) {
            showToaster('An error occurred. Please try again.', 'error');
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
        }
    };

    submitButton.addEventListener('click', handleFormSubmit);

    function showToaster(message, type) {
        toaster.textContent = message;
        toaster.className = `toaster show ${type}`;
        setTimeout(() => {
            toaster.className = 'toaster';
        }, 3000);
    }

    // Service Detail Modal Logic
    const serviceDetailModal = document.getElementById('service-detail-modal');
    const closeModalButton = serviceDetailModal.querySelector('.close-button');
    const modalServiceTitle = document.getElementById('modal-service-title');
    const modalServiceDescription = document.getElementById('modal-service-description');
    const modalServiceDetailsList = document.getElementById('modal-service-details-list');
    const serviceCards = document.querySelectorAll('.service-card');

    // Parse service details from the script tag
    const serviceDetailsScript = document.getElementById('service-details');
    const allServiceDetails = JSON.parse(serviceDetailsScript.textContent);

    serviceCards.forEach(card => {
        card.addEventListener('click', () => {
            const serviceId = card.dataset.service;
            const details = allServiceDetails[serviceId];

            if (details) {
                modalServiceTitle.textContent = details.title;
                modalServiceDescription.textContent = details.description;
                modalServiceDetailsList.innerHTML = ''; // Clear previous details

                details.details.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    modalServiceDetailsList.appendChild(li);
                });

                serviceDetailModal.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Prevent scrolling background
            }
        });
    });

    closeModalButton.addEventListener('click', () => {
        serviceDetailModal.style.display = 'none';
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal if clicked outside content
    window.addEventListener('click', (event) => {
        if (event.target === serviceDetailModal) {
            serviceDetailModal.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
});
window.addEventListener("scroll", function() {
  const header = document.querySelector("header");
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});
