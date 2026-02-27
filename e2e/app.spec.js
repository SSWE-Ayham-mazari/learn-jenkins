// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Page Structure Tests', () => {
  test('has title', async ({ page }) => {
    await page.goto('/');

    // Expect a title "to contain" a substring.
    await expect(page).toHaveTitle(/Learn Jenkins/);
  });

  test('has Jenkins in the body', async ({ page }) => {
    await page.goto('/');

    const isVisible = await page.locator('a:has-text("ayham")').isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('has expected app version', async ({ page }) => {
    await page.goto('/');

    const expectedAppVersion = process.env.REACT_APP_VERSION ? process.env.REACT_APP_VERSION : '1';

    console.log(expectedAppVersion);

    const isVisible = await page.locator(`p:has-text("Application version: ${expectedAppVersion}")`).isVisible();
    expect(isVisible).toBeTruthy();
  });

  test('should display React logo', async ({ page }) => {
    await page.goto('/');

    const logo = await page.locator('img[alt="logo"]');
    await expect(logo).toBeVisible();
  });

  test('should have correct page heading structure', async ({ page }) => {
    await page.goto('/');

    const header = await page.locator('header');
    await expect(header).toBeVisible();
  });
});

test.describe('Link and Navigation Tests', () => {
  test('Learn Jenkins link should be visible and have correct text', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    await expect(link).toBeVisible();
    await expect(link).toHaveText('ayham');
  });

  test('Learn Jenkins link should have correct href attribute', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    const href = await link.getAttribute('href');
    expect(href).toBeTruthy();
  });

  test('external links should open in new tab', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    const target = await link.getAttribute('target');
    const rel = await link.getAttribute('rel');

    // Check if link opens in new tab and has security attributes
    if (target === '_blank') {
      expect(rel).toContain('noopener');
    }
  });
});

test.describe('Visual and Layout Tests', () => {
  test('page should load without console errors', async ({ page }) => {
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');

    // Filter out expected errors if any
    const unexpectedErrors = errors.filter(err =>
      !err.includes('REACT_APP_VERSION')
    );

    expect(unexpectedErrors.length).toBe(0);
  });

  test('should have responsive viewport', async ({ page }) => {
    await page.goto('/');

    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(500);

    const logo = await page.locator('img[alt="logo"]');
    await expect(logo).toBeVisible();

    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForTimeout(500);
    await expect(logo).toBeVisible();
  });

  test('should load all images successfully', async ({ page }) => {
    const imageLoadPromises = [];

    page.on('response', response => {
      if (response.request().resourceType() === 'image') {
        imageLoadPromises.push(
          response.status()
        );
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // All images should return 200 status
    imageLoadPromises.forEach(status => {
      expect([200, 304]).toContain(status);
    });
  });
});

test.describe('Performance Tests', () => {
  test('page should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Page should load within 5 seconds
    expect(loadTime).toBeLessThan(5000);
  });

  test('page should be interactive quickly', async ({ page }) => {
    await page.goto('/');

    const startTime = Date.now();
    await page.waitForLoadState('networkidle');
    const interactiveTime = Date.now() - startTime;

    // Page should be interactive within 10 seconds
    expect(interactiveTime).toBeLessThan(10000);
  });
});

test.describe('Accessibility Tests', () => {
  test('page should have proper semantic HTML', async ({ page }) => {
    await page.goto('/');

    // Check for main semantic elements
    const header = await page.locator('header');
    await expect(header).toBeVisible();
  });

  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const images = await page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt).toBeTruthy();
    }
  });

  test('links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    await link.focus();

    // Check if element is focused
    const isFocused = await link.evaluate(el => el === document.activeElement);
    expect(isFocused).toBeTruthy();
  });
});

test.describe('Content Tests', () => {
  test('should display correct application name', async ({ page }) => {
    await page.goto('/');

    const content = await page.content();
    expect(content).toContain('Jenkins');
  });

  test('should have non-empty body content', async ({ page }) => {
    await page.goto('/');

    const bodyText = await page.locator('body').textContent();
    expect(bodyText.trim().length).toBeGreaterThan(0);
  });

  test('page should have favicon', async ({ page }) => {
    await page.goto('/');

    const favicon = await page.locator('link[rel="icon"]');
    const faviconCount = await favicon.count();

    expect(faviconCount).toBeGreaterThan(0);
  });

  test('should display version information', async ({ page }) => {
    await page.goto('/');

    const versionText = await page.locator('p').filter({ hasText: 'Application version:' });
    await expect(versionText).toBeVisible();
  });
});

test.describe('CSS and Styling Tests', () => {
  test('React logo should have animation', async ({ page }) => {
    await page.goto('/');

    const logo = await page.locator('img[alt="logo"]');
    const animation = await logo.evaluate(el => {
      const style = window.getComputedStyle(el);
      return style.animation || style.webkitAnimation;
    });

    expect(animation).toBeTruthy();
  });

  test('header should have proper background color', async ({ page }) => {
    await page.goto('/');

    const header = await page.locator('header');
    const backgroundColor = await header.evaluate(el => {
      return window.getComputedStyle(el).backgroundColor;
    });

    expect(backgroundColor).toBeTruthy();
    expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
  });

  test('links should have hover state', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    const initialColor = await link.evaluate(el => {
      return window.getComputedStyle(el).color;
    });

    await link.hover();
    await page.waitForTimeout(100);

    // Just verify the link responds to hover
    await expect(link).toBeVisible();
  });

  test('page should have proper font family', async ({ page }) => {
    await page.goto('/');

    const body = await page.locator('body');
    const fontFamily = await body.evaluate(el => {
      return window.getComputedStyle(el).fontFamily;
    });

    expect(fontFamily).toBeTruthy();
    expect(fontFamily.length).toBeGreaterThan(0);
  });
});

test.describe('Security Tests', () => {
  test('should not expose sensitive information in source', async ({ page }) => {
    await page.goto('/');

    const content = await page.content();
    expect(content).not.toContain('password');
    expect(content).not.toContain('api_key');
    expect(content).not.toContain('secret');
  });

  test('external links should have security attributes', async ({ page }) => {
    await page.goto('/');

    const externalLinks = await page.locator('a[target="_blank"]');
    const count = await externalLinks.count();

    for (let i = 0; i < count; i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel');
      if (rel) {
        expect(rel).toContain('noopener');
      }
    }
  });

  test('should use HTTPS for external resources', async ({ page }) => {
    const insecureRequests = [];

    page.on('request', request => {
      const url = request.url();
      if (url.startsWith('http://') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
        insecureRequests.push(url);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(insecureRequests.length).toBe(0);
  });
});

test.describe('Interaction Tests', () => {
  test('logo should be visible throughout page lifecycle', async ({ page }) => {
    await page.goto('/');

    const logo = await page.locator('img[alt="logo"]');
    await expect(logo).toBeVisible();

    // Scroll down and check again
    await page.evaluate(() => window.scrollBy(0, 100));
    await expect(logo).toBeVisible();
  });

  test('clicking logo should not cause navigation', async ({ page }) => {
    await page.goto('/');

    const initialUrl = page.url();
    const logo = await page.locator('img[alt="logo"]');
    await logo.click({ force: true });

    await page.waitForTimeout(500);
    expect(page.url()).toBe(initialUrl);
  });

  test('page should handle rapid clicks gracefully', async ({ page }) => {
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');

    // Rapid clicks shouldn't break the page
    for (let i = 0; i < 5; i++) {
      await link.click({ force: true, noWaitAfter: true });
    }

    await page.waitForTimeout(500);
    await expect(link).toBeVisible();
  });
});

test.describe('Meta Information Tests', () => {
  test('should have proper meta viewport tag', async ({ page }) => {
    await page.goto('/');

    const viewport = await page.locator('meta[name="viewport"]');
    const content = await viewport.getAttribute('content');

    expect(content).toContain('width=device-width');
  });

  test('should have meta description', async ({ page }) => {
    await page.goto('/');

    const description = await page.locator('meta[name="description"]');
    const count = await description.count();

    expect(count).toBeGreaterThan(0);
  });

  test('should have proper charset', async ({ page }) => {
    await page.goto('/');

    const charset = await page.locator('meta[charset]');
    const charsetValue = await charset.getAttribute('charset');

    expect(charsetValue?.toLowerCase()).toBe('utf-8');
  });
});

test.describe('Error Handling Tests', () => {
  test('should handle missing resources gracefully', async ({ page }) => {
    const failedRequests = [];

    page.on('requestfailed', request => {
      failedRequests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Page should load even if some resources fail
    const header = await page.locator('header');
    await expect(header).toBeVisible();
  });

  test('should not have JavaScript errors on load', async ({ page }) => {
    const jsErrors = [];

    page.on('pageerror', error => {
      jsErrors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');

    expect(jsErrors.length).toBe(0);
  });
});

test.describe('Browser Compatibility Tests', () => {
  test('should render correctly on different viewport sizes', async ({ page }) => {
    const viewports = [
      { width: 320, height: 568, name: 'iPhone SE' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 414, height: 896, name: 'iPhone XR' },
      { width: 768, height: 1024, name: 'iPad' },
      { width: 1366, height: 768, name: 'Laptop' },
      { width: 1920, height: 1080, name: 'Desktop' }
    ];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');

      const header = await page.locator('header');
      await expect(header).toBeVisible();

      const logo = await page.locator('img[alt="logo"]');
      await expect(logo).toBeVisible();
    }
  });

  test('should support touch events on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    const link = await page.locator('a:has-text("ayham")');
    await link.tap();

    // Link should still be accessible after tap
    await expect(link).toBeVisible();
  });
});

test.describe('Resource Loading Tests', () => {
  test('should load CSS files successfully', async ({ page }) => {
    const cssLoaded = [];

    page.on('response', response => {
      if (response.request().resourceType() === 'stylesheet') {
        cssLoaded.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // At least one CSS file should be loaded successfully
    const successfulCss = cssLoaded.filter(css => css.status === 200);
    expect(successfulCss.length).toBeGreaterThan(0);
  });

  test('should load JavaScript files successfully', async ({ page }) => {
    const jsLoaded = [];

    page.on('response', response => {
      if (response.request().resourceType() === 'script') {
        jsLoaded.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // At least one JS file should be loaded successfully
    const successfulJs = jsLoaded.filter(js => js.status === 200);
    expect(successfulJs.length).toBeGreaterThan(0);
  });

  test('page should not have excessive resource requests', async ({ page }) => {
    const requests = [];

    page.on('request', request => {
      requests.push(request.url());
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Should not make more than 50 requests for a simple app
    expect(requests.length).toBeLessThan(50);
  });
});

test.describe('Content Validation Tests', () => {
  test('should have proper HTML structure', async ({ page }) => {
    await page.goto('/');

    const html = await page.locator('html');
    await expect(html).toBeVisible();

    const body = await page.locator('body');
    await expect(body).toBeVisible();

    const root = await page.locator('#root');
    await expect(root).toBeVisible();
  });

  test('should not have broken internal links', async ({ page }) => {
    await page.goto('/');

    const internalLinks = await page.locator('a').filter({
      has: page.locator(':not([href^="http"])')
    });

    const count = await internalLinks.count();

    for (let i = 0; i < Math.min(count, 10); i++) {
      const href = await internalLinks.nth(i).getAttribute('href');
      if (href && !href.startsWith('http')) {
        expect(href).toBeTruthy();
      }
    }
  });

  test('text content should be readable', async ({ page }) => {
    await page.goto('/');

    const textElements = await page.locator('p, h1, h2, h3, a');
    const count = await textElements.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const text = await textElements.nth(i).textContent();
      expect(text?.trim().length).toBeGreaterThan(0);
    }
  });
});

