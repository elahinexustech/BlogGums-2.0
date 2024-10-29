import React, { Component } from 'react';
import './settings.css';
import { ThemeContext } from '../ThemeProvider/ThemeProvider';

class SettingsUIWindow extends Component {
  static contextType = ThemeContext;

  constructor(props) {
    super(props);
    this.state = {
      selectedColor: localStorage.getItem('color') || 'original',
    };
  }

  componentDidMount() {
    this.applyColorClass(); // Apply color class when the component mounts
  }

  applyColorClass = () => {
    const { selectedColor } = this.state;

    // Remove any existing color class from the body
    document.body.classList.forEach(className => {
      if (className.startsWith("theme-color-")) {
        document.body.classList.remove(className);
      }
    });

    // Add the new color class based on the selected color
    document.body.classList.add(`theme-color-${selectedColor}`);
  };

  handleColorChange = (color) => {
    localStorage.setItem('color', color);
    this.setState({ selectedColor: color }, this.applyColorClass);
  };


  logOut = () => {
    if(confirm("Are you sure to logout!")) {
      document.body.classList.add("disabled");
        localStorage.clear();
        location.reload()

    }
  }

  render() {
    const { stat } = this.props; // Get visibility state from props
    const { darkTheme, toggleTheme } = this.context;

    return (
      <div className={`settings obj ${stat ? "show" : ""}`}>
        <section className="header flex">
          <p className="heading text-center grey">Settings</p>
        </section>
        <section className='body'>
          <section className='settings-sections general'>
            <p className="caption grey">General</p><br />
            <label className='flex jc-spb'>
              <p>Send Email Notifications</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </label>

            <label className='flex jc-spb'>
              <p>SMS Notifications</p>
              <label className="switch">
                <input type="checkbox" />
                <span className="slider"></span>
              </label>
            </label>
          </section>

          <section className='settings-sections appearance'>
            <p className="caption grey">Appearance</p><br />

            <label className='flex jc-spb'>
              <p>Dark theme</p>
              <label className="switch">
                <input
                  type="checkbox"
                  onChange={toggleTheme}
                  checked={darkTheme}
                />
                <span className="slider"></span>
              </label>
            </label>

            <label className='flex direction-col ai-start'>
              <p>Accent Colour</p>
              <br />
              <section className='flex jc-start' style={{ "gap": "0.5rem" }}>
                {['original', 'orange', 'blue', 'red', 'green'].map(color => (
                  <span
                    key={color}
                    className={`color-circles ${color} ${this.state.selectedColor === color ? 'active' : ''}`}
                    onClick={() => this.handleColorChange(color)}
                  ></span>
                ))}
              </section>
            </label>
          </section>

          <section className="settings-sections danger">
            <p className="caption grey">Danger</p>
            <br />
            <label className='flex jc-spb'>
              <p>Logout</p>
              <button className='error' onClick={this.logOut}>Logout</button>
            </label>

          </section>

        </section>
      </div>
    );
  }
}

export default SettingsUIWindow;
