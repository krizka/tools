/**
 * Created by kriz on 21/02/16.
 */

import React, { Component } from 'react';

export const createHandledComponent = function (Children) {
    const placer = React.createClass({
        getInitialState() {
            return {
                handleActive: false
            }
        },

        componentDidMount() {
            placer.instance = this;
        },

        componentWillUnmount() {
            delete placer.instance;
        },

        render() {
            if (this.state.handleActive) {
                const { handleActive, ...props } = this.state;

                return <Children {...props} />
            }
            return <div/>;
        }
    });

    const handle = React.createClass({
        componentWillMount() {
            placer.instance.setState({ ...this.props, handleActive: true });
        },

        componentWillUnmount() {
            placer.instance.replaceState({ handleActive: false });
        },

        render() {
            return <div/>;
        }
    });

    return {
        placer,
        handle
    }
};

const placeholders = {};

export class Placeholder extends Component {
    constructor(props) {
        super(props);
        this.state = { children: null }
    }

    componentWillMount() {
        const { name } = this.props;
        placeholders[name] = this;
    }

    componentWillUnmount() {
        delete placeholders[name];
    }

    render() {
        const { children } = this.state;
        return <div>{children}</div>;
    }
}

export class RenderTo extends Component {
    componentWillMount() {
        const { name, children } = this.props;
        placeholders[name].setState({ children });
    }

    componentWillReceiveProps(props) {
        const { name, children } = props;
        placeholders[name].setState({ children });
    }

    componentWillUnmount() {
        const { name } = this.props;
        placeholders[name].replaceState({ children: null });
    }

    render() {
        return <div/>;
    }
}