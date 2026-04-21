# Contributing to ElectIQ

First off, thank you for considering contributing to ElectIQ! We welcome contributions from everyone to help make election education more accessible and engaging.

### How Can I Contribute?

*   **Reporting Bugs**: If you find a bug, please open an issue with a clear description and steps to reproduce.
*   **Suggesting Enhancements**: Have an idea for a new feature? We'd love to hear it! Open an issue to discuss.
*   **Pull Requests**: 
    1. Fork the repository.
    2. Create a new branch for your feature or bugfix.
    3. Make your changes and ensure they follow the project style.
    4. Run all tests using `npm test`.
    5. Submit a pull request.

### Development Setup

1.  **Node.js**: Ensure you have Node.js 18 or higher installed.
2.  **Clone & Install**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/electiq.git
    cd electiq
    npm install
    ```
3.  **Environment Variables**: Create a `.env` file based on `.env.example`. You will need API keys for:
    *   Google Gemini API
    *   Google Maps JavaScript API
    *   Firebase Service Account (optional but recommended for history/scores)

### Coding Standards

*   **JavaScript**: Use modern ES6+ features. Follow the existing style in `server.js` and `js/app.js`.
*   **CSS**: Use clean, responsive Vanilla CSS. Avoid adding external styling libraries unless discussed.
*   **Security**: Always prioritize user data privacy and input sanitization.

### Testing

We use Jest for testing. All new features should include appropriate tests.
```bash
npm test              # Run all tests
npm run test:coverage # Check test coverage
```

### Commit Messages

*   Use clear, descriptive commit messages.
*   Reference issues if applicable (e.g., `fixes #123`).

Thank you for being part of the ElectIQ community!
