 const usernameInput = document.getElementById('usernameInput');
        const searchBtn = document.getElementById('searchBtn');
        const userSection = document.getElementById('userSection');
        const reposSection = document.getElementById('reposSection');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const errorMessage = document.getElementById('errorMessage');
        const noUserMessage = document.getElementById('noUserMessage');
        const tryAgainBtn = document.getElementById('tryAgainBtn');
        const errorText = document.getElementById('errorText');
        
        // User data elements
        const userAvatar = document.getElementById('userAvatar');
        const userName = document.getElementById('userName');
        const userLogin = document.getElementById('userLogin');
        const userBio = document.getElementById('userBio');
        const followersCount = document.getElementById('followersCount');
        const followingCount = document.getElementById('followingCount');
        const publicReposCount = document.getElementById('publicReposCount');
        const publicGistsCount = document.getElementById('publicGistsCount');
        const userLocation = document.getElementById('userLocation');
        const userBlog = document.getElementById('userBlog');
        const userTwitter = document.getElementById('userTwitter');
        const userCompany = document.getElementById('userCompany');
        const userCreatedAt = document.getElementById('userCreatedAt');
        const userUpdatedAt = document.getElementById('userUpdatedAt');
        const userProfileLink = document.getElementById('userProfileLink');
        const reposCount = document.getElementById('reposCount');
        const reposGrid = document.getElementById('reposGrid');
        
        // Event Listeners
        searchBtn.addEventListener('click', searchUser);
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchUser();
            }
        });
        
        tryAgainBtn.addEventListener('click', function() {
            hideAllSections();
            usernameInput.focus();
        });
        
        // Initialize with a sample user
        window.addEventListener('DOMContentLoaded', function() {
            usernameInput.value = 'octocat';
            searchUser();
        });
        
        // Function to search for a GitHub user
        async function searchUser() {
            const username = usernameInput.value.trim();
            
            if (!username) {
                showNoUserMessage();
                return;
            }
            
            // Show loading indicator
            hideAllSections();
            loadingIndicator.classList.add('active');
            
            try {
                // Fetch user data from GitHub API
                const userResponse = await fetch(`https://api.github.com/users/${username}`);
                
                if (!userResponse.ok) {
                    throw new Error(`User not found (Status: ${userResponse.status})`);
                }
                
                const userData = await userResponse.json();
                
                // Fetch user repositories
                const reposResponse = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`);
                const reposData = await reposResponse.json();
                
                // Hide loading indicator
                loadingIndicator.classList.remove('active');
                
                // Display user data
                displayUserData(userData);
                
                // Display repositories
                displayRepos(reposData);
                
            } catch (error) {
                // Hide loading indicator
                loadingIndicator.classList.remove('active');
                
                // Show error message
                errorText.textContent = error.message;
                errorMessage.classList.add('active');
                console.error('Error fetching GitHub data:', error);
            }
        }
        
        // Function to display user data
        function displayUserData(user) {
            // Set user information
            userAvatar.src = user.avatar_url || 'https://via.placeholder.com/120';
            userName.textContent = user.name || user.login;
            userLogin.textContent = `@${user.login}`;
            userBio.textContent = user.bio || 'No bio available';
            
            // Set user stats
            followersCount.textContent = user.followers.toLocaleString();
            followingCount.textContent = user.following.toLocaleString();
            publicReposCount.textContent = user.public_repos.toLocaleString();
            publicGistsCount.textContent = user.public_gists.toLocaleString();
            
            // Set user details
            userLocation.textContent = user.location || 'Not specified';
            userBlog.textContent = user.blog || 'Not specified';
            userTwitter.textContent = user.twitter_username ? `@${user.twitter_username}` : 'Not specified';
            userCompany.textContent = user.company || 'Not specified';
            
            // Format dates
            const joinDate = new Date(user.created_at);
            const updateDate = new Date(user.updated_at);
            userCreatedAt.textContent = joinDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            userUpdatedAt.textContent = updateDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            // Set profile link
            userProfileLink.href = user.html_url;
            
            // Show user section
            userSection.classList.add('active');
        }
        
        // Function to display repositories
        function displayRepos(repos) {
            // Update repos count
            reposCount.textContent = `${repos.length} repos`;
            
            // Clear previous repos
            reposGrid.innerHTML = '';
            
            // Check if user has repositories
            if (repos.length === 0) {
                reposGrid.innerHTML = `
                    <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #8b949e;">
                        <i class="fas fa-code-branch" style="font-size: 3rem; margin-bottom: 15px;"></i>
                        <h3>No public repositories found</h3>
                    </div>
                `;
            } else {
                // Add each repository to the grid
                repos.forEach(repo => {
                    // Create language color indicator
                    const languageColor = getLanguageColor(repo.language);
                    const languageElement = repo.language ? 
                        `<span class="language" style="background-color: ${languageColor};"></span>${repo.language}` : 
                        'Not specified';
                    
                    // Format date
                    const updatedDate = new Date(repo.updated_at);
                    const formattedDate = updatedDate.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                    });
                    
                    // Create repo card
                    const repoCard = document.createElement('div');
                    repoCard.className = 'repo-card';
                    repoCard.innerHTML = `
                        <div class="repo-name">
                            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                            ${repo.fork ? '<span style="font-size: 0.8rem; color: #8b949e; background: #21262d; padding: 3px 8px; border-radius: 12px;">Fork</span>' : ''}
                        </div>
                        <p class="repo-desc">${repo.description || 'No description available'}</p>
                        <div class="repo-meta">
                            <span><i class="fas fa-code"></i> ${languageElement}</span>
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count.toLocaleString()}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count.toLocaleString()}</span>
                            <span><i class="fas fa-calendar-alt"></i> ${formattedDate}</span>
                        </div>
                    `;
                    
                    reposGrid.appendChild(repoCard);
                });
            }
            
            // Show repos section
            reposSection.classList.add('active');
        }
        
        // Function to get language color
        function getLanguageColor(language) {
            const languageColors = {
                'JavaScript': '#f1e05a',
                'Python': '#3572A5',
                'Java': '#b07219',
                'TypeScript': '#2b7489',
                'C++': '#f34b7d',
                'C#': '#178600',
                'PHP': '#4F5D95',
                'Ruby': '#701516',
                'CSS': '#563d7c',
                'HTML': '#e34c26',
                'Go': '#00ADD8',
                'Rust': '#dea584',
                'Swift': '#ffac45',
                'Kotlin': '#F18E33',
                'Shell': '#89e051',
                'Dart': '#00B4AB'
            };
            
            return languageColors[language] || '#8b949e';
        }
        
        // Function to hide all sections
        function hideAllSections() {
            userSection.classList.remove('active');
            reposSection.classList.remove('active');
            loadingIndicator.classList.remove('active');
            errorMessage.classList.remove('active');
            noUserMessage.classList.remove('active');
        }
        
        // Function to show no user message
        function showNoUserMessage() {
            hideAllSections();
            noUserMessage.classList.add('active');
        }