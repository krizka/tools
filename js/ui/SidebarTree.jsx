/**
 * Created by kriz on 02/07/2017.
 */

import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import TreeView from './TreeView';

function collapse(node, i, getChildren) {
    node.view.setState({ collapsed: i <= 0 });
    const children = getChildren(node);
    if (children)
        children.forEach(n => collapse(n, i - 1, getChildren));
}

function showTree(node, renderNode, getChildren) {
    return <div key={node._id}>
        <ButtonGroup>
            {_.range(0, 5).map(i =>
                <Button key={i} bsSize="xsmall" onClick={() => collapse(node, i, getChildren)}>{i + 1}</Button>)}
        </ButtonGroup>
        {renderTree(node, 0, renderNode, getChildren)}
    </div>;
}

function renderTree(node, level, renderNode, getChildren) {
    const children = getChildren(node);
    return (<TreeView ref={r => node.view = r} defaultCollapsed={true} key={node._id || Random.id()} nodeLabel=
        {renderNode(node)}
    >
        {children && children.length ? children.map(c => renderTree(c, level + 1, renderNode, getChildren)) : undefined}
    </TreeView>);
}

export const SidebarTree = ({ trees, renderNode, getChildren }) => (<div>
    {trees.map(tree => tree && showTree(tree, renderNode, getChildren))}
</div>);

export const Tree = ({ node, renderNode, getChildren }) =>
    showTree(node, renderNode, getChildren);
