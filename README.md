# QuizSpark - Adaptive Quiz Application

![QuizSpark Logo](/assests/logo.png)

## Overview

QuizSpark is an adaptive quiz application that challenges users with questions that adjust in difficulty based on their performance. The application offers quizzes on various topics, providing an engaging learning experience that evolves with the user's knowledge level.

## Features

- **Adaptive Difficulty**: Questions automatically adjust to match your skill level
- **Multiple Topics**: Choose from a variety of subjects to test your knowledge
- **Real-time Feedback**: Get immediate feedback on your answers
- **Dynamic UI**: Clean, responsive interface with light and dark theme options
- **Performance Summary**: Review your score and personalized feedback at the end of each quiz

## Technologies Used

- HTML5
- CSS3 (with CSS Variables for theming)
- JavaScript (ES6+)
- Open Trivia Database API for question data
- Feather Icons for UI elements

## Getting Started

### Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection to fetch quiz questions

### Installation

1. Clone the repository or download the project files
   ```
   git clone https://github.com/yourusername/quizspark.git
   ```
   
2. Navigate to the project directory
   ```
   cd quizspark
   ```

3. Open `index.html` in your browser

### Local Development

For the best development experience, use a local development server:

```bash
# Using Python 3
python -m http.server

# Or with Node.js
npx serve
```

## How to Use

1. Select a topic from the main screen
2. Answer questions that appear one at a time
3. Receive instant feedback on your answers
4. If you answer correctly, subsequent questions increase in difficulty
5. If you answer incorrectly, subsequent questions decrease in difficulty
6. Review your final score and feedback at the end
7. Click "Play Another Round" to start a new quiz on any topic

## Project Structure

```
adapt-quiz/
├── assets/         # Images and other assets
├── css/
│   └── style.css   # Styling with light/dark theme support
├── js/
│   └── script.js   # Application logic and API integration
├── index.html      # Main HTML structure
└── README.md       # Project documentation
```

## API Integration

QuizSpark uses the [Open Trivia Database API](https://opentdb.com/api_config.php) to fetch quiz questions across multiple categories and difficulty levels.

## Future Enhancements

- User accounts to track progress over time
- Custom quiz creation and sharing
- Additional question types (true/false, fill in the blank)
- Offline mode with cached questions
- Timed quiz mode
- Social sharing of results

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Open Trivia Database](https://opentdb.com/) for providing the free question API
- [Feather Icons](https://feathericons.com/) for beautiful UI icons
- [Google Fonts](https://fonts.google.com/) for Poppins and Inter font families
- [Unsplash](https://unsplash.com/) for the hero image

---

Designed and developed with ❤️ for learning and fun!

© 2025 QuizSpark. All Rights Reserved.
