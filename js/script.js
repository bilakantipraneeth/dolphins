document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const navLinks = document.querySelector('.nav-links');
    const menuButton = document.querySelector('.menu-button');

    menuButton.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    navLinks.addEventListener('click', () => {
        navLinks.classList.remove('active');
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
                showToaster(`Please fill out the ${field.name} field.`, 'error');
            }
        });

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
});
