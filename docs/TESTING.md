# Testing Guide

## Overview

This document explains how to run tests for the BDS-App project.

## Test Structure

Tests are colocated with the code they test:
- Unit tests for domain entities are in the same directory as the entities
- Unit tests for common utilities are in the same directory as the utilities
- Integration tests will be in the integration layer directories

## Running Tests

### Prerequisites

Make sure you have all dependencies installed:

```bash
npm install
```

### Running All Tests

To run all tests:

```bash
npm test
```

Currently, this will just show an error message because we haven't set up a proper testing framework yet.

### Manual Testing

You can manually test the application by starting the development server:

```bash
npm run dev
```

Then visit http://localhost:3000 in your browser.

## Future Testing Setup

We plan to set up Jest for unit testing in Week 2. The commands will be:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Coverage Goals

- Domain layer: 90%+ coverage
- Common layer: 90%+ coverage
- Enactment layer interfaces: 100% coverage (they're just interfaces)
- Infrastructure layer: 80%+ coverage
- Integration layer: 80%+ coverage
- Presentation layer: 70%+ coverage (UI tests are harder to maintain)

## Testing Principles

1. **Test behavior, not implementation**: Focus on what the code does, not how it does it
2. **Keep tests independent**: Each test should be able to run in isolation
3. **Use descriptive test names**: Test names should clearly describe what is being tested
4. **Follow the AAA pattern**: Arrange, Act, Assert
5. **Test edge cases**: Don't just test the happy path
6. **Mock external dependencies**: Keep tests fast and reliable