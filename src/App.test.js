import { render, screen, within } from '@testing-library/react';
import App from './App';

describe('App Component - Basic Rendering', () => {
  test('renders learn Jenkins link', () => {
    render(<App />);
    const linkElement = screen.getByText(/learn Jenkins/i);
    expect(linkElement).toBeInTheDocument();
  });

  test('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('renders the main app div', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });

  test('renders header element', () => {
    const { container } = render(<App />);
    const header = container.querySelector('.App-header');
    expect(header).toBeInTheDocument();
  });
});

describe('App Component - Logo Tests', () => {
  test('renders logo image', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  test('logo has correct CSS class', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveClass('App-logo');
  });

  test('logo has src attribute', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveAttribute('src');
  });

  test('logo src points to SVG file', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    const src = logo.getAttribute('src');
    expect(src).toContain('.svg');
  });
});

describe('App Component - Link Tests', () => {
  test('renders Udemy link with correct text', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toBeInTheDocument();
  });

  test('link has correct href attribute', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toHaveAttribute('href', 'https://example.com');
  });

  test('link opens in new tab', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('link has security attributes', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  test('link has correct CSS class', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toHaveClass('App-link');
  });

  test('link is clickable', async () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toBeEnabled();
  });
});

describe('App Component - Version Display', () => {
  test('renders application version text', () => {
    render(<App />);
    const version = screen.getByText(/Application version:/i);
    expect(version).toBeInTheDocument();
  });

  test('displays version number', () => {
    render(<App />);
    const version = screen.getByText('Application version: 1');
    expect(version).toBeInTheDocument();
  });

  test('version is in a paragraph element', () => {
    const { container } = render(<App />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toHaveTextContent('Application version: 1');
  });
});

describe('App Component - Structure Tests', () => {
  test('header contains logo', () => {
    const { container } = render(<App />);
    const header = container.querySelector('.App-header');
    const logo = within(header).getByAltText('logo');
    expect(logo).toBeInTheDocument();
  });

  test('header contains link', () => {
    const { container } = render(<App />);
    const header = container.querySelector('.App-header');
    const link = within(header).getByText('ayham');
    expect(link).toBeInTheDocument();
  });

  test('app has correct number of child elements', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    expect(appDiv.children.length).toBeGreaterThan(0);
  });
});

describe('App Component - Accessibility Tests', () => {
  test('logo has alt text for screen readers', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveAttribute('alt', 'logo');
  });

  test('link is keyboard accessible', () => {
    render(<App />);
    const link = screen.getByRole('link', { name: /ayham/i });
    expect(link).toBeInTheDocument();
  });

  test('all images have alt attributes', () => {
    const { container } = render(<App />);
    const images = container.querySelectorAll('img');
    images.forEach(img => {
      expect(img).toHaveAttribute('alt');
    });
  });

  test('header has semantic HTML', () => {
    const { container } = render(<App />);
    const header = container.querySelector('header');
    expect(header).toBeInTheDocument();
  });
});

describe('App Component - Content Tests', () => {
  test('renders expected text content', () => {
    const { container } = render(<App />);
    expect(container).toHaveTextContent('Learn Jenkins');
    expect(container).toHaveTextContent('Application version');
  });

  test('contains Jenkins keyword', () => {
    const { container } = render(<App />);
    expect(container.textContent).toMatch(/Jenkins/i);
  });

  test('renders multiple text elements', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    const version = screen.getByText(/Application version/i);
    expect(link).toBeInTheDocument();
    expect(version).toBeInTheDocument();
  });
});

describe('App Component - CSS Classes', () => {
  test('app div has App class', () => {
    const { container } = render(<App />);
    const appDiv = container.querySelector('.App');
    expect(appDiv).toBeInTheDocument();
  });

  test('header has App-header class', () => {
    const { container } = render(<App />);
    const header = container.querySelector('.App-header');
    expect(header).toBeInTheDocument();
  });

  test('logo has App-logo class', () => {
    render(<App />);
    const logo = screen.getByAltText('logo');
    expect(logo).toHaveClass('App-logo');
  });

  test('link has App-link class', () => {
    render(<App />);
    const link = screen.getByText('ayham');
    expect(link).toHaveClass('App-link');
  });
});

describe('App Component - Integration Tests', () => {
  test('renders complete component hierarchy', () => {
    const { container } = render(<App />);
    const app = container.querySelector('.App');
    const header = container.querySelector('.App-header');
    const logo = screen.getByAltText('logo');
    const link = screen.getByText('ayham');
    const version = screen.getByText(/Application version/i);

    expect(app).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(logo).toBeInTheDocument();
    expect(link).toBeInTheDocument();
    expect(version).toBeInTheDocument();
  });

  test('all interactive elements are present', () => {
    render(<App />);
    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  test('component renders consistently', () => {
    const { container: container1 } = render(<App />);
    const { container: container2 } = render(<App />);

    expect(container1.textContent).toBe(container2.textContent);
  });
});

describe('App Component - Edge Cases', () => {
  test('renders without errors when mounted multiple times', () => {
    const { unmount } = render(<App />);
    unmount();

    const { container } = render(<App />);
    expect(container).toBeInTheDocument();
  });

  test('maintains structure after re-render', () => {
    const { rerender, container } = render(<App />);
    const initialContent = container.innerHTML;

    rerender(<App />);
    expect(container.innerHTML).toBe(initialContent);
  });
});

describe('App Component - Snapshot Test', () => {
  test('matches snapshot', () => {
    const { container } = render(<App />);
    expect(container.firstChild).toMatchSnapshot();
  });
});

