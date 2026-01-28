/**
 * App.js
 * Main application logic, router, and UI renderer.
 */

const App = {
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.checkAuth();
        this.renderFeatured();
    },

    cacheDOM() {
        this.dom = {
            app: document.getElementById('app'),
            navLinks: document.querySelectorAll('.nav-links a'),
            views: document.querySelectorAll('.view'),

            // Auth UI
            authModal: document.getElementById('authModal'),
            btnLogin: document.getElementById('btnLogin'),
            btnSignup: document.getElementById('btnSignup'),
            btnLogout: document.getElementById('btnLogout'),
            btnCloseModal: document.querySelector('.btn-close'),
            authButtons: document.getElementById('authButtons'),
            userMenu: document.getElementById('userMenu'),
            userNameDisplay: document.getElementById('userNameDisplay'),

            // Forms
            loginForm: document.getElementById('loginForm'),
            signupForm: document.getElementById('signupForm'),
            formLoginDiv: document.getElementById('formLogin'),
            formSignupDiv: document.getElementById('formSignup'),
            switchSignup: document.getElementById('switchSignup'),
            switchLogin: document.getElementById('switchLogin'),

            // Listings
            featuredListings: document.getElementById('featuredListings'),
            exploreListings: document.getElementById('exploreListings'),
            dashboardListings: document.getElementById('dashboardListings'),

            // Dashboard
            navDashboard: document.getElementById('navDashboard'),
            addListingForm: document.getElementById('addListingForm'),

            // Filters
            exploreSearch: document.getElementById('exploreSearch'),
            exploreType: document.getElementById('exploreType'),
            explorePrice: document.getElementById('explorePrice'),

            // Listing Details Modal
            listingModal: document.getElementById('listingModal'),
            btnCloseListing: document.getElementById('btnCloseListing'),
            modalImage: document.getElementById('modalImage'),
            modalTitle: document.getElementById('modalTitle'),
            modalPrice: document.getElementById('modalPrice'),
            modalLocation: document.getElementById('modalLocation'),
            modalDistance: document.getElementById('modalDistance'),
            modalTags: document.getElementById('modalTags'),
            modalDescription: document.getElementById('modalDescription'),
            modalOwnerName: document.getElementById('modalOwnerName'),
            btnContactOwner: document.getElementById('btnContactOwner'),
            btnContactOwner: document.getElementById('btnContactOwner'),
            btnWishlist: document.getElementById('btnWishlist'),
            btnBookNow: document.getElementById('btnBookNow'),

            // Student Dashboard
            studentDashboard: document.getElementById('studentDashboard'),
            ownerDashboard: document.getElementById('ownerDashboard'),
            wishlistListings: document.getElementById('wishlistListings'),
            bookingListings: document.getElementById('bookingListings'),
            dashboardWelcome: document.getElementById('dashboardWelcome'),
            tabBtns: document.querySelectorAll('.tab-btn'),
            tabContents: document.querySelectorAll('.tab-content'),
        };
    },

    bindEvents() {
        // Navigation
        this.dom.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            });
        });

        // Auth Modals
        this.dom.btnLogin.addEventListener('click', () => this.showAuth('login'));
        this.dom.btnSignup.addEventListener('click', () => this.showAuth('signup'));
        this.dom.btnLogout.addEventListener('click', () => Auth.logout());
        this.dom.btnCloseModal.addEventListener('click', () => this.closeAuth());

        // Switch Forms
        this.dom.switchSignup.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForm('signup');
        });
        this.dom.switchLogin.addEventListener('click', (e) => {
            e.preventDefault();
            this.toggleAuthForm('login');
        });

        // Form Submit
        this.dom.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        this.dom.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        if (this.dom.addListingForm) {
            this.dom.addListingForm.addEventListener('submit', (e) => this.handleAddListing(e));
        }

        // Listing Details
        if (this.dom.btnCloseListing) {
            this.dom.btnCloseListing.addEventListener('click', () => this.closeListingDetails());
        }

        // Filters
        if (this.dom.exploreSearch) {
            this.dom.exploreSearch.addEventListener('input', () => this.renderExplore());
            this.dom.exploreType.addEventListener('change', () => this.renderExplore());
            this.dom.explorePrice.addEventListener('change', () => this.renderExplore());
        }

        // Dashboard Tabs
        this.dom.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.getAttribute('data-tab');

                // Update UI
                this.dom.tabBtns.forEach(b => {
                    b.classList.remove('active');
                    b.style.color = 'var(--color-text-muted)';
                    b.style.borderBottomColor = 'transparent';
                });
                this.dom.tabContents.forEach(c => c.classList.add('hidden'));

                e.target.classList.add('active');
                e.target.style.color = 'var(--color-primary)';
                e.target.style.borderBottomColor = 'var(--color-primary)';

                document.getElementById(`tab-${tab}`).classList.remove('hidden');
            });
        });

        // Modal Actions
        if (this.dom.btnWishlist) {
            this.dom.btnWishlist.addEventListener('click', () => this.handleWishlistToggle());
        }
        if (this.dom.btnBookNow) {
            this.dom.btnBookNow.addEventListener('click', () => this.handleBooking());
        }
    },

    navigateTo(pageId) {
        // Simple routing
        this.dom.navLinks.forEach(link => link.classList.remove('active'));
        document.querySelector(`[data-page="${pageId}"]`)?.classList.add('active');

        this.dom.views.forEach(view => view.classList.add('hidden'));
        document.getElementById(`view-${pageId}`)?.classList.remove('hidden');

        if (pageId === 'explore') {
            this.renderExplore();
        } else if (pageId === 'dashboard') {
            this.renderDashboard();
        }
    },

    // --- Authentication UI ---

    checkAuth() {
        if (Auth.isLoggedIn()) {
            const user = Auth.getUser();
            this.dom.authButtons.classList.add('hidden');
            this.dom.userMenu.classList.remove('hidden');
            this.dom.userNameDisplay.textContent = user.name;

            // Show correct dashboard based on role
            if (user.role === 'owner' || user.role === 'admin') {
                this.dom.navDashboard.classList.remove('hidden');
            } else if (user.role === 'student') {
                this.dom.navDashboard.classList.remove('hidden');
            } else {
                this.dom.navDashboard.classList.add('hidden');
            }
        } else {
            this.dom.authButtons.classList.remove('hidden');
            this.dom.userMenu.classList.add('hidden');
            this.dom.navDashboard.classList.add('hidden');
        }
    },

    showAuth(mode = 'login') {
        this.dom.authModal.classList.remove('hidden');
        this.toggleAuthForm(mode);
    },

    closeAuth() {
        this.dom.authModal.classList.add('hidden');
    },

    toggleAuthForm(mode) {
        if (mode === 'login') {
            this.dom.formLoginDiv.classList.remove('hidden');
            this.dom.formSignupDiv.classList.add('hidden');
        } else {
            this.dom.formLoginDiv.classList.add('hidden');
            this.dom.formSignupDiv.classList.remove('hidden');
        }
    },

    handleLogin(e) {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;

        const result = Auth.login(email, password);
        if (result.success) {
            this.closeAuth();
            this.checkAuth();
            alert(`Welcome back, ${result.user.name}!`);
        } else {
            alert(result.message);
        }
    },

    handleSignup(e) {
        e.preventDefault();
        const name = e.target.name.value;
        const email = e.target.email.value;
        const password = e.target.password.value;
        const role = e.target.role.value;

        const result = Auth.signup(name, email, password, role);
        if (result.success) {
            this.closeAuth();
            this.checkAuth();
            alert('Account created successfully!');
        } else {
            alert(result.message);
        }
    },

    handleAddListing(e) {
        e.preventDefault();
        const user = Auth.getUser();
        if (!user) return;

        const formData = new FormData(e.target);
        const newListing = {
            id: Date.now().toString(),
            ownerId: user.id,
            title: formData.get('title'),
            location: formData.get('location'),
            type: formData.get('type'),
            price: Number(formData.get('price')),
            image: formData.get('image') || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=60',
            description: formData.get('description'),
            distance: 'Near Campus', // Placeholder
            tags: [formData.get('type'), 'Verified']
        };

        Store.addListing(newListing);
        alert('Listing published successfully!');
        e.target.reset();
        this.renderDashboard();
    },

    renderDashboard() {
        if (user.role === 'owner' || user.role === 'admin') {
            // Owner View
            this.dom.ownerDashboard.classList.remove('hidden');
            this.dom.studentDashboard.classList.add('hidden');

            const myListings = Store.getListings().filter(l => l.ownerId === user.id);
            if (this.dom.dashboardListings) {
                if (myListings.length === 0) {
                    this.dom.dashboardListings.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.6);">You haven\'t posted any listings yet.</p>';
                } else {
                    this.dom.dashboardListings.innerHTML = myListings.map(l => this.createListingCard(l)).join('');
                }
            }
        } else if (user.role === 'student') {
            // Student View
            this.dom.ownerDashboard.classList.add('hidden');
            this.dom.studentDashboard.classList.remove('hidden');
            this.dom.dashboardWelcome.textContent = `Welcome, ${user.name}`;
            this.renderStudentDashboard(user);
        }
    },

    renderStudentDashboard(user) {
        // Wishlist
        const listings = Store.getListings();
        const wishlistIds = user.wishlist || [];
        const wishlistItems = listings.filter(l => wishlistIds.includes(l.id));

        if (this.dom.wishlistListings) {
            if (wishlistItems.length === 0) {
                this.dom.wishlistListings.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.6);">Your wishlist is empty.</p>';
            } else {
                this.dom.wishlistListings.innerHTML = wishlistItems.map(l => this.createListingCard(l)).join('');
            }
        }

        // Bookings
        const bookings = user.bookings || [];
        // Map bookings to listings and include status
        const bookedListings = bookings.map(b => {
            const listing = listings.find(l => l.id === b.listingId);
            return listing ? { ...listing, bookingStatus: b.status, bookingDate: b.date } : null;
        }).filter(item => item !== null);

        if (this.dom.bookingListings) {
            if (bookedListings.length === 0) {
                this.dom.bookingListings.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.6);">You have no active bookings.</p>';
            } else {
                this.dom.bookingListings.innerHTML = bookedListings.map(l => `
                    <div class="card">
                        <img src="${l.image}" alt="${l.title}" class="card-image" style="height:150px;">
                        <div class="card-content">
                             <h3 class="card-title">${l.title}</h3>
                             <div class="card-meta" style="margin-bottom:10px;">
                                <span>📅 Booked on ${new Date(l.bookingDate).toLocaleDateString()}</span>
                             </div>
                             <span style="background:${l.bookingStatus === 'pending' ? 'var(--color-primary)' : '#10b981'}; padding:4px 10px; border-radius:4px; font-size:0.8rem;">${l.bookingStatus.toUpperCase()}</span>
                        </div>
                    </div>
                `).join('');
            }
        }
    },

    handleWishlistToggle() {
        // We need the current listing ID showing in the modal
        // A simple way is to store it on the modal element when opening
        const listingId = this.dom.listingModal.getAttribute('data-active-listing');
        const user = Auth.getUser();

        if (!user) {
            alert('Please login to use Wishlist');
            return;
        }

        const updatedUser = Store.toggleWishlist(user.id, listingId);

        // Update Session
        sessionStorage.setItem('mec_session', JSON.stringify(updatedUser));

        // Update Button Text
        const inWishlist = updatedUser.wishlist && updatedUser.wishlist.includes(listingId);
        this.dom.btnWishlist.textContent = inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
        this.dom.btnWishlist.style.background = inWishlist ? 'var(--color-primary)' : 'transparent';
        this.dom.btnWishlist.style.color = inWishlist ? '#fff' : 'var(--color-text-main)';

        // Refresh dashboard if open
        this.renderDashboard();
    },

    handleBooking() {
        const listingId = this.dom.listingModal.getAttribute('data-active-listing');
        const user = Auth.getUser();

        if (!user) {
            alert('Please login to book a property');
            return;
        }

        const result = Store.bookListing(user.id, listingId);
        if (result.success) {
            alert('Booking request sent successfully!');
            // Update Session
            sessionStorage.setItem('mec_session', JSON.stringify(result.user));
            this.renderDashboard();
            this.closeListingDetails();
        } else {
            alert(result.message);
        }
    },

    // --- Rendering ---

    createListingCard(listing) {
        return `
            <div class="card" onclick="App.openListingDetails('${listing.id}')">
                <img src="${listing.image}" alt="${listing.title}" class="card-image" loading="lazy">
                <div class="card-content">
                    <div class="card-header">
                        <h3 class="card-title">${listing.title}</h3>
                        <div class="card-price">₹${listing.price}<span>/mo</span></div>
                    </div>
                    <div class="card-meta">
                        <span>📍 ${listing.location}</span>
                        <span>📏 ${listing.distance}</span>
                    </div>
                    <div class="tags" style="margin-top:10px;">
                        ${listing.tags.map(tag => `<span style="font-size:0.8rem; background:rgba(255,255,255,0.1); padding:2px 8px; border-radius:4px; margin-right:5px;">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    openListingDetails(listingId) {
        const listing = Store.getListings().find(l => l.id === listingId);
        if (!listing) return;

        const owner = Store.getUsers().find(u => u.id === listing.ownerId);
        const ownerName = owner ? owner.name : 'Verified Owner';
        const ownerEmail = owner ? owner.email : 'support@mechanven.com';

        // Populate Modal
        this.dom.modalImage.src = listing.image;
        this.dom.modalTitle.textContent = listing.title;
        this.dom.modalPrice.innerHTML = `₹${listing.price}<span>/mo</span>`;
        this.dom.modalLocation.textContent = `📍 ${listing.location}`;
        this.dom.modalDistance.textContent = `📏 ${listing.distance}`;
        this.dom.modalDescription.textContent = listing.description;
        this.dom.modalOwnerName.textContent = ownerName;
        this.dom.listingModal.setAttribute('data-active-listing', listingId);

        // Update Buttons based on User State
        const user = Auth.getUser();
        if (user && user.role === 'student') {
            this.dom.btnWishlist.classList.remove('hidden');
            this.dom.btnBookNow.classList.remove('hidden');

            // Check Wishlist State
            const inWishlist = user.wishlist && user.wishlist.includes(listingId);
            this.dom.btnWishlist.textContent = inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist';
            this.dom.btnWishlist.style.background = inWishlist ? 'var(--color-primary)' : 'transparent';
            this.dom.btnWishlist.style.color = inWishlist ? '#fff' : 'var(--color-text-main)';

        } else {
            // Hide for Owners/Guests
            this.dom.btnWishlist.classList.add('hidden');
            this.dom.btnBookNow.classList.add('hidden');
        }

        // Tags
        this.dom.modalTags.innerHTML = listing.tags.map(tag =>
            `<span style="background:var(--color-primary); padding:4px 12px; border-radius:20px; font-size:0.85rem; margin-right:8px; display:inline-block; margin-bottom:5px;">${tag}</span>`
        ).join('');

        // Contact Button
        const subject = encodeURIComponent(`Inquiry about: ${listing.title}`);
        const body = encodeURIComponent(`Hello ${ownerName},\n\nI am interested in your listing "${listing.title}" in ${listing.location}.\n\nPlease let me know if it is still available.\n\nThanks,`);
        this.dom.btnContactOwner.href = `mailto:${ownerEmail}?subject=${subject}&body=${body}`;

        // Show Modal
        this.dom.listingModal.classList.remove('hidden');
    },

    closeListingDetails() {
        this.dom.listingModal.classList.add('hidden');
    },

    renderFeatured() {
        const listings = Store.getListings().slice(0, 3); // Top 3
        this.dom.featuredListings.innerHTML = listings.map(l => this.createListingCard(l)).join('');
        this.dom.featuredListings.classList.remove('skeleton'); // Remove loading state
    },

    renderExplore() {
        let listings = Store.getListings();

        // Apply Filters
        const searchText = this.dom.exploreSearch?.value.toLowerCase() || '';
        const filterType = this.dom.exploreType?.value || '';
        const filterPrice = this.dom.explorePrice?.value || '';

        listings = listings.filter(l => {
            // Text Search (Title or Location)
            const matchesSearch = l.title.toLowerCase().includes(searchText) ||
                l.location.toLowerCase().includes(searchText);

            // Type Filter
            const matchesType = filterType === '' || l.type === filterType;

            // Price Filter
            const matchesPrice = filterPrice === '' || l.price <= Number(filterPrice);

            return matchesSearch && matchesType && matchesPrice;
        });

        if (this.dom.exploreListings) {
            if (listings.length === 0) {
                this.dom.exploreListings.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: rgba(255,255,255,0.6);">No listings found matching your criteria.</p>';
            } else {
                this.dom.exploreListings.innerHTML = listings.map(l => this.createListingCard(l)).join('');
            }
        }
    }
};

// Start App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
