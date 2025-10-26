// ============================
// Faith Academy Ogba - JS Logic
// ============================

// Add CSS for notifications first
const notificationStyles = `
@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideOutRight {
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.notification-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0;
  font-size: 0.9rem;
}
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Sidebar toggle for mobile
function initializeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.querySelector(".toggle-menu");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }

  // Close sidebar when clicking outside on mobile
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 1024) {
      if (!sidebar.contains(e.target) && !e.target.closest('.toggle-menu')) {
        sidebar.classList.remove("active");
      }
    }
  });
}

// Submenu functionality
function initializeSubmenus() {
  const menuItems = document.querySelectorAll('.menu-item.has-submenu');
  
  menuItems.forEach(item => {
    const link = item.querySelector('a');
    const submenu = item.querySelector('.submenu');
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Close other open submenus
      menuItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.submenu').classList.remove('active');
        }
      });
      
      // Toggle current submenu
      item.classList.toggle('active');
      submenu.classList.toggle('active');
    });
  });
}

// Dashboard functionality
function initializeDashboard() {
  // Animate stat numbers
  animateStatNumbers();
  
  // Initialize charts if on dashboard
  if (document.querySelector('.stats-section')) {
    initializeDashboardCharts();
  }
}

// Animate counting numbers
function animateStatNumbers() {
  const statNumbers = document.querySelectorAll('.stat-number');
  
  statNumbers.forEach(stat => {
    const target = parseInt(stat.textContent.replace(/,/g, '')); // Remove commas if present
    let count = 0;
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    
    const updateCount = () => {
      if (count < target) {
        count += increment;
        stat.textContent = Math.ceil(count).toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        stat.textContent = target.toLocaleString();
      }
    };
    
    // Start animation when element is in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          updateCount();
          observer.unobserve(entry.target);
        }
      });
    });
    
    observer.observe(stat);
  });
}

// Initialize dashboard charts
function initializeDashboardCharts() {
  // This would integrate with Chart.js or similar library
  console.log('Dashboard charts initialized');
}

// Form handling
function handleFormSubmission(formId, callback) {
  const form = document.getElementById(formId);
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (typeof callback === 'function') {
        callback(form);
      }
    });
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Check if notification already exists and remove it
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${getNotificationIcon(type)}"></i>
      <span>${message}</span>
    </div>
    <button class="notification-close"><i class="fas fa-times"></i></button>
  `;
  
  document.body.appendChild(notification);
  
  // Add styles for notification
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${getNotificationColor(type)};
    color: white;
    padding: 15px 20px;
    border-radius: 5px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 400px;
    animation: slideInRight 0.3s ease;
  `;
  
  // Close button
  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.addEventListener('click', () => {
    notification.style.animation = 'slideOutRight 0.3s ease';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 300);
  });
  
  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

function getNotificationIcon(type) {
  const icons = {
    success: 'check-circle',
    error: 'exclamation-circle',
    warning: 'exclamation-triangle',
    info: 'info-circle'
  };
  return icons[type] || 'info-circle';
}

function getNotificationColor(type) {
  const colors = {
    success: '#28a745',
    error: '#dc3545',
    warning: '#ffc107',
    info: '#17a2b8'
  };
  return colors[type] || '#17a2b8';
}

// Additional functionality for new pages
function initializeCBT() {
  // CBT specific functionality
  const examCards = document.querySelectorAll('.exam-card');
  
  examCards.forEach(card => {
    const endExamBtn = card.querySelector('.danger');
    if (endExamBtn) {
      endExamBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const examName = card.querySelector('h3').textContent;
        if (confirm(`Are you sure you want to end "${examName}"?`)) {
          showNotification(`Ending exam: ${examName}`, 'success');
          // Add logic to end exam
        }
      });
    }
  });
}

function initializeUserManagement() {
  // User management functionality
  const resetPasswordBtns = document.querySelectorAll('.fa-key');
  
  resetPasswordBtns.forEach(icon => {
    const btn = icon.closest('button');
    if (btn) {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const userName = row.querySelector('strong').textContent;
        showNotification(`Reset password for ${userName}`, 'info');
      });
    }
  });
}

function initializeStaffManagement() {
  // Staff management functionality
  const viewProfileBtns = document.querySelectorAll('.fa-eye');
  
  viewProfileBtns.forEach(icon => {
    const btn = icon.closest('button');
    if (btn) {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const staffName = row.querySelector('strong').textContent;
        showNotification(`Viewing profile: ${staffName}`, 'info');
      });
    }
  });
}

// Main initialization function
document.addEventListener("DOMContentLoaded", () => {
  initializeSidebar();
  initializeSubmenus();
  initializeDashboard();
  
  // Initialize page-specific functionality
  if (document.querySelector('.exams-list')) {
    initializeCBT();
  }
  
  if (document.querySelector('.users-filters')) {
    initializeUserManagement();
  }
  
  if (document.querySelector('.staff-departments')) {
    initializeStaffManagement();
  }
});

// Export functions for use in other modules
window.SchoolManagement = {
  showNotification,
  handleFormSubmission,
  initializeSidebar,
  initializeSubmenus,
  initializeDashboard,
  initializeCBT,
  initializeUserManagement,
  initializeStaffManagement
};