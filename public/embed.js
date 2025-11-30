(function() {
  function initEmbed() {
    const containers = document.querySelectorAll('.waitbridge-embed');
    
    containers.forEach(container => {
      // Prevent double initialization
      if (container.getAttribute('data-initialized') === 'true') return;
      
      const waitlistId = container.getAttribute('data-waitlist-id');
      const transparent = container.getAttribute('data-transparent') === 'true';
      const hideLogo = container.getAttribute('data-hide-logo') === 'true';
      
      if (!waitlistId) {
        console.error('Waitbridge: No waitlist ID provided');
        return;
      }

      // Create iframe
      const iframe = document.createElement('iframe');
      const baseUrl = document.currentScript ? new URL(document.currentScript.src).origin : 'https://waitbridge.com';
      
      // Construct URL
      let widgetUrl = `${baseUrl}/widget/${waitlistId}`;
      if (transparent) {
        widgetUrl += '?transparent=true';
      }
      if (hideLogo) {
        widgetUrl += (transparent ? '&' : '?') + 'hideLogo=true';
      }
      
      iframe.src = widgetUrl;
      iframe.style.width = '100%';
      iframe.style.height = '400px'; // Default height, can be overridden by CSS
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.setAttribute('loading', 'lazy');
      
      // Clear container and append iframe
      container.innerHTML = '';
      container.appendChild(iframe);
      container.setAttribute('data-initialized', 'true');
    });
  }

  // Run on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEmbed);
  } else {
    initEmbed();
  }
  
  // Expose for manual re-init if needed (e.g. SPA navigation)
  window.Waitbridge = {
    init: initEmbed
  };
})();
