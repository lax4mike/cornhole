import React from "react";
import { bool, func, string, node } from "prop-types";
import classNames from "classnames";

export default class Modal extends React.Component {

  static propTypes = {
    title: node,
    isOpen: bool.isRequired,
    onClose: func.isRequired,
    className: string,
    children: node.isRequired
  };

  componentDidMount = () => {
    this.toggleKeydownHandler(this.props.isOpen);
  }

  componentWillUnmount = () => {
    window.removeEventListener("keydown", this.keydownHandler);
  }

  componentDidUpdate = (prevProps, prevState) => {
    this.toggleKeydownHandler(this.props.isOpen);
  }

  toggleKeydownHandler = (isOpen) => {
    if (isOpen){
      window.addEventListener("keydown", this.keydownHandler);
    }
    else {
      window.removeEventListener("keydown", this.keydownHandler);
    }
  }

  keydownHandler = (e) => {
    if(e.key === "Escape"){
      this.props.onClose();
    }
  }

  render = () => {
    const { isOpen, onClose, title, children, className, ...rest } = this.props;

    const classes = classNames("modal", className, {
      "is-open": isOpen
    });

    return (
      <div className={classes} {...rest} >
        <div className="modal__box-holder">
          <div className="modal__overlay" onClick={onClose} />
          <div className="modal__box" >
            <div className="modal__title">
              {title}
              <div className="modal__close" onClick={onClose}>
                <svg width="24" height="24" className="octicon octicon-x" viewBox="0 0 12 16" aria-hidden="true" {...rest}>
                  <path  d="M7.48 8l3.75 3.75-1.48 1.48L6 9.48l-3.75 3.75-1.48-1.48L4.52 8 .77 4.25l1.48-1.48L6 6.52l3.75-3.75 1.48 1.48z" />
                </svg>
              </div>
            </div>
            <div className="modal__content">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  };
}
