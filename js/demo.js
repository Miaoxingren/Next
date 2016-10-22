(function(nx) {
    nx.define("lynx.Nav", nx.graphic.Topology.Nav, {
        view: function(view) {
            var addLinkMode = {
                name: 'addLinkMode',
                tag: 'li',
                content: {
                    props: {
                        'class': 'n-icon-expand',
                        title: "Add Link mode"
                    },
                    tag: 'span'
                },
                events: {
                    'mousedown': '{#_switchAddLinkMode}',
                    'touchstart': '{#_switchAddLinkMode}'
                }
            };
            var deleteLinkMode = {
                name: 'deleteLinkMode',
                tag: 'li',
                content: {
                    props: {
                        'class': 'n-icon-collapse',
                        title: "Delete Link mode"
                    },
                    tag: 'span'
                },
                events: {
                    'mousedown': '{#_switchDeleteLinkMode}',
                    'touchstart': '{#_switchDeleteLinkMode}'
                }
            };
            var mode = view.content[0].content[0].content;
            if (mode.name === 'mode') {
                mode.content.push(addLinkMode);
                mode.content.push(deleteLinkMode);
            }
            return view;
        },
        methods: {
            _switchAddLinkMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'addLink') {
                    topo.activateScene('addLink');
                    this._prevSceneName = currentSceneName;
                }
            },
            _switchDeleteLinkMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'deleteLink') {
                    topo.activateScene('deleteLink');
                    this._prevSceneName = currentSceneName;
                }
            }
        }
    });

    nx.define("lynx.LinkTopology", nx.graphic.Topology, {
        view: function(view) {
            var nav = view.content[1];
            if (nav.name === 'nav') {
                nav.type = "lynx.Nav";
            }
            return view;
        }
    });

    nx.define('lynx.AddLinkScene', nx.graphic.Topology.SelectionNodeScene, {
        properties: {
            selectedNodes: {
                get: function() {
                    return this.topology().selectedNodes();
                }
            }
        },
        methods: {
            selectNodeSet: function(sender, nodeset) {},
            pressNodeSet: function(sender, nodeSet) {},
            dragStage: function(sender, event) {
                var rect = this.rect;
                var origin = event.drag.origin;
                var size = event.drag.offset;
                // check if width negative
                if (size[0] < 0) {
                    rect.set('x', origin[0] + size[0]);
                    rect.set('width', -size[0]);
                } else {
                    rect.set('x', origin[0]);
                    rect.set('width', size[0]);
                }
                if (size[1] < 0) {
                    rect.set('y', origin[1] + size[1]);
                    rect.set('height', -size[1]);
                } else {
                    rect.set('y', origin[1]);
                    rect.set('height', size[1]);
                }
            },
            pressStage: function(sender, event) {
                var selectedNodes = this.selectedNodes();
                var count = this._topo.selectedNodes().count();
                if (count >= 2) {
                    selectedNodes.clear();
                }

                event.captureDrag(sender.stage().view(), this.topology().stage());
            },
            pressNode: function(sender, node) {
                if (node.enable()) {
                    var selectedNodes = this.selectedNodes();
                    var count = this._topo.selectedNodes().count();
                    if (count >= 2) {
                        selectedNodes.clear();
                    }
                    node.selected(!node.selected());
                }
            },

            enterNode: function() {},
            clickNode: function(sender, node) {},


            selectNode: function(sender, node) {
                if (node.selected()) {
                    this._topo.selectedNodes().add(node);
                    this._createLink();
                } else {
                    this._topo.selectedNodes().remove(node);
                }
            },
            _createLink: function () {
                var selectedNodes = this.selectedNodes();
                var count = this._topo.selectedNodes().count();
                if (count == 2) {
                    var source = selectedNodes.getItem(0);
                    var target = selectedNodes.getItem(1);
                    this._topo.addLink({
                        source: source.id(),
                        target: target.id()
                    });
                }
            }

        }
    });

    nx.define('lynx.DeleteLinkScene', nx.graphic.Topology.SelectionNodeScene, {
        properties: {
            selectedNodes: {
                get: function() {
                    return this.topology().selectedNodes();
                }
            }
        },
        methods: {
            selectNodeSet: function(sender, nodeset) {},
            pressNodeSet: function(sender, nodeSet) {},
            dragStage: function(sender, event) {
                var rect = this.rect;
                var origin = event.drag.origin;
                var size = event.drag.offset;
                // check if width negative
                if (size[0] < 0) {
                    rect.set('x', origin[0] + size[0]);
                    rect.set('width', -size[0]);
                } else {
                    rect.set('x', origin[0]);
                    rect.set('width', size[0]);
                }
                if (size[1] < 0) {
                    rect.set('y', origin[1] + size[1]);
                    rect.set('height', -size[1]);
                } else {
                    rect.set('y', origin[1]);
                    rect.set('height', size[1]);
                }
            },
            pressStage: function(sender, event) {
                var selectedNodes = this.selectedNodes();
                var count = this._topo.selectedNodes().count();
                if (count >= 2) {
                    selectedNodes.clear();
                }

                event.captureDrag(sender.stage().view(), this.topology().stage());
            },
            pressNode: function(sender, node) {
                if (node.enable()) {
                    var selectedNodes = this.selectedNodes();
                    var count = this._topo.selectedNodes().count();
                    if (count >= 2) {
                        selectedNodes.clear();
                    }
                    node.selected(!node.selected());
                }
            },

            enterNode: function() {},
            clickNode: function(sender, node) {},


            selectNode: function(sender, node) {
                if (node.selected()) {
                    this._topo.selectedNodes().add(node);
                    this._deleteLink();
                } else {
                    this._topo.selectedNodes().remove(node);
                }
            },
            _deleteLink: function () {
                var selectedNodes = this.selectedNodes();
                var count = this._topo.selectedNodes().count();
                if (count == 2) {
                    var source = selectedNodes.getItem(0);
                    var target = selectedNodes.getItem(1);
                    var links = this._topo.getLinksByNode(source.id(), target.id());
                    this._topo.removeLink();
                }
            }

        }
    });

})(nx);

window.onload = function() {
    var topologyData = {
        nodes: [{
            "id": 0,
            "x": 410,
            "y": 100,
            "name": "12K-1"
        }, {
            "id": 1,
            "x": 410,
            "y": 280,
            "name": "12K-2"
        }, {
            "id": 2,
            "x": 660,
            "y": 280,
            "name": "Of-9k-03"
        }, {
            "id": 3,
            "x": 660,
            "y": 100,
            "name": "Of-9k-02"
        }, {
            "id": 4,
            "x": 180,
            "y": 190,
            "name": "Of-9k-01"
        }],
        links: [{
            "source": 0,
            "target": 3
        }]
    };
    var app = new nx.ui.Application();
    app.container(document.getElementById('topologyPanel'));
    var topology = new lynx.LinkTopology({
        adaptive: true,
        identityKey: 'id',
        nodeConfig: {
            label: 'model.name',
            iconType: 'model.iconType'
        },
        nodeSetConfig: {
            label: 'model.id',
            iconType: 'model.iconType',
            fillColor: 'red',
            strokeColor: 'black',
            color: 'red'
        },
        showIcon: true
    });
    topology.data(topologyData);
    topology.registerScene("addLink", "lynx.AddLinkScene");
    topology.registerScene("deleteLink", "lynx.DeleteLinkScene");
    topology.attach(app);
};
