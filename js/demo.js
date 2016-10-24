(function(nx, global) {
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
            var editLinkMode = {
                name: 'editLinkMode',
                tag: 'li',
                content: {
                    props: {
                        'class': 'n-icon-aggregation',
                        title: "Edit Link mode"
                    },
                    tag: 'span'
                },
                events: {
                    'mousedown': '{#_switcheEditLinkMode}',
                    'touchstart': '{#_switcheEditLinkMode}'
                }
            };
            var mode = view.content[0].content[0].content;
            if (mode.name === 'mode') {
                mode.content.push(addLinkMode);
                mode.content.push(deleteLinkMode);
                mode.content.push(editLinkMode);
            }
            return view;
        },
        methods: {
            _switcheEditLinkMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'editLink') {
                    topo.activateScene('editLink');
                    this._prevSceneName = currentSceneName;
                }
            },
            _switchAddLinkMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'addLink') {
                    topo.activateScene('addLink');
                    this._prevSceneName = currentSceneName;
                }
            },
            _switchMoveMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'default') {
                    topo.activateScene('default');
                }
            },
            _switchDeleteLinkMode: function(sender, event) {
                var topo = this.topology();
                var currentSceneName = topo.currentSceneName();
                if (currentSceneName != 'deleteLink') {
                    topo.activateScene('deleteLink');
                    this._prevSceneName = currentSceneName;
                }
            },
            attach: function(args) {
                this.inherited(args);
                var topo = this.topology();
                topo.watch('currentSceneName', function(prop, currentSceneName) {
                    var modes = this.view("mode").get("content");
                    nx.each(modes, function(mode) {
                        var name = mode._resources["@name"];
                        if (currentSceneName + "Mode" === name || (currentSceneName === 'default' && name === 'moveMode')) {
                            this.view(name).dom().addClass("n-topology-nav-mode-selected");
                        } else {
                            this.view(name).dom().removeClass("n-topology-nav-mode-selected");
                        }
                    }, this);
                }, this);
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
            _createLink: function() {
                var selectedNodes = this.selectedNodes();
                var topo = this._topo;
                var count = topo.selectedNodes().count();
                if (count == 2) {
                    var source = selectedNodes.getItem(0);
                    var target = selectedNodes.getItem(1);
                    var links = topo.getLinksByNode(source.id(), target.id());
                    if (!links) {
                        this._topo.addLink({
                            source: source.id(),
                            target: target.id()
                        });
                    }
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
            _deleteLink: function() {
                var selectedNodes = this.selectedNodes();
                var count = this._topo.selectedNodes().count();
                if (count == 2) {
                    var source = selectedNodes.getItem(0);
                    var target = selectedNodes.getItem(1);
                    var topo = this._topo;
                    var links = topo.getLinksByNode(source.id(), target.id());
                    nx.each(links, function(link) {
                        topo.removeLink(link);
                    });

                }
            }

        }
    });

    nx.define('lynx.EditLinkScene', nx.graphic.Topology.DefaultScene, {
        properties: {
            switchPanelClass: {
                value: 'lynx.SwitchPanel'
            },
            switchPanel: {},
            showSwitchPanel: {
                value: true
            },
        },
        methods: {
            activate: function() {
                this.inherited();
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(false);
            },
            deactivate: function() {
                this.inherited();
                var tooltipManager = this._tooltipManager;
                tooltipManager.activated(true);
            },
            pressLink: function(sender, link) {

            },
            openSwitchPanel: function (link) {
                var topo = this.topology();
                var switchPanel = this.switchPanel();
                var content;

                switchPanel.close(true);

                if (this.showSwitchPanel() === false) {
                    return;
                }

                var contentClass = nx.path(global, this.switchPanelClass());
                if (contentClass) {
                    content = new contentClass();
                    content.sets({
                        topology: topo,
                        link: link,
                        model: topo.model()
                    });
                }

                if (content) {
                    switchPanel.content(null);
                    content.attach(switchPanel);
                }

                var size = node.getBound(true);

                switchPanel.open({
                    target: pos,
                    offset: Math.max(size.height, size.width) / 2
                });

                this.fire("openNodeToolTip", node);
            },
            clickLink: function(sender, link) {

            },
            enterLink: function(sender, link) {

            },
            leaveLink: function(sender, link) {

            }
        }
    });

    nx.define('lynx.SwitchPanel', nx.ui.Component, {
        properties: {
            visible: {
                get: function () {
                    return this._visible !== undefined ? this._visible : true;
                },
                set: function (value) {
                    if (this.view()) {
                        if (value) {
                            this.view().dom().removeClass('n-hidden');
                        } else {
                            this.view().dom().addClass('n-hidden');
                        }

                    }
                    this._visible = value;
                }
            },
            node: {
                set: function (value) {
                    var model = value.model();
                    this.view('list').set('items', new nx.data.Dictionary(model.getData()));
                    this.title(value.label());
                }
            },
            topology: {},
            title: {}
            _sourceId: null,
            _targetId: null
        },
        view: {
            content: [{
                tag: 'div',
                props: {
                    'class': 'btn btn-default'
                },
                content: [],
                events: {}
            }, {
                tag: 'div',
                props: {
                    'class': 'btn btn-default'
                },
                content: [],
                events: {}
            }]
        },
        methods: {

        }
    });

})(nx, nx.global);

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
        supportMultipleLink: false,
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
    topology.registerScene("editLink", "lynx.EditLinkScene");
    topology.attach(app);
};
