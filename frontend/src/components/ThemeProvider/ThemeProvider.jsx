import React, { createContext, Component } from 'react';

const ThemeContext = createContext();

class ThemeProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      darkTheme: localStorage.getItem("theme") === "dark",
      color: localStorage.getItem("color") || 'default'  // default color if no color is set
    };
  }

  componentDidMount() {
    this.applyTheme();
    this.applyColorTheme();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.darkTheme !== this.state.darkTheme) {
      this.applyTheme();
    }

    if (prevState.color !== this.state.color) {
      this.applyColorClass();
    }
  }

  componentWillUnmount() {
    const themeColorsContainer = document.querySelector(".js-theme-colors");
    if (themeColorsContainer) {
      themeColorsContainer.removeEventListener("click", this.handleColorClick);
    }
  }

  applyTheme = () => {
    localStorage.setItem("theme", this.state.darkTheme ? "dark" : "light");
    document.body.classList.toggle("dark-theme", this.state.darkTheme);
  };

  applyColorTheme = () => {
    const themeColorsContainer = document.querySelector(".js-theme-colors");

    if (themeColorsContainer) {
      themeColorsContainer.addEventListener("click", this.handleColorClick);
    }

    // Apply the initial color class when the component mounts
    this.applyColorClass();
  };

  handleColorClick = (event) => {
    const target = event.target;
    if (target.classList.contains("js-theme-color-item")) {
      const newColor = target.getAttribute("data-js-theme-color");
      localStorage.setItem("color", newColor);
      this.setState({ color: newColor });
    }
  };

  applyColorClass = () => {
    const { color } = this.state;

    // Remove any existing color class from the body
    document.body.classList.forEach(className => {
      if (className.startsWith("theme-color-")) {
        document.body.classList.remove(className);
      }
    });

    // Add the new color class based on the selected color
    document.body.classList.add(`theme-color-${color}`);
  };

  toggleTheme = () => {
    this.setState(prevState => ({ darkTheme: !prevState.darkTheme }));
  };

  render() {
    return (
      <ThemeContext.Provider value={{
        darkTheme: this.state.darkTheme,
        toggleTheme: this.toggleTheme,
        color: this.state.color
      }}>
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

export default ThemeProvider; // Correct default export
export { ThemeContext }; // Named export for ThemeContext

export const useTheme = () => {
  return React.useContext(ThemeContext);
};
