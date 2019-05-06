import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class ListLazy extends React.Component {
  state = {
    isReady: false
  };

  // ставлю интервал
  componentDidMount() {
    this.intervalId = setTimeout(
      () => this.setState({ isReady: true }),
      this.props.interval
    );
  }
  componentWillUnmount() {
    clearTimeout(this.intervalId);
  }
  // рендерю
  render() {
    const { isReady } = this.state;
    const { list } = this.props;

    // проверю на null (вроде)
    if (!isReady) return null;
    return list.map(el => <li>{el}</li>);
  }
}

class ListLazyController extends React.Component {
  render() {
    const { list } = this.props;
    return (
      // маркированный список
      <ul>
        {list
          .reduce((acc, el, i) => {
            const step = Math.round(i / 10000);
            acc[step] = acc[step] || [];
            acc[step].push(el);
            return acc;
          }, [])
          .map((listStep, i) => (
            <ListLazy list={listStep} interval={i * 50} />
          ))}
      </ul>
    );
  }
}
// интервал
const interateCount = 500;

// вариант 2
class ListLazyContainer extends React.Component {
  state = {
    listFull: this.props.list,
    list: this.props.list.slice(0, interateCount)
  };

  // снова интервал
  incrementList = () => {
    const { list, listFull } = this.state;
    if (list.length !== listFull.length) {
      this.setState({
        list: listFull.slice(0, list.length + interateCount)
      });
      requestAnimationFrame(this.incrementList);
    }
  };

  componentDidMount() {
    requestAnimationFrame(this.incrementList);
  }

  // отрисовываю
  render() {
    const { list } = this.state;
    return (
      // маркированный список
      <ul>
        {list.map(el => (
          <li>{el}</li>
        ))}
      </ul>
    );
  }
}

const App = () => (
  <main>
    <ListLazyContainer list={Array.from({ length: 10000 }).map((el, i) => i)} />
    <ListLazyController
      list={Array.from({ length: 10000 }).map((el, i) => i)}
    />
  </main>
);

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
