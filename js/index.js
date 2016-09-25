
//multiarea-networks
(function (nx) {
    nx.define('CustomTooltipPolicy',nx.graphic.Topology.TooltipPolicy, {
        'methods': {
            'init': function(args){
                this.inherited(args);
            },
            // click makes tooltip appear
            'clickNodeSet': function(nodeSet){
                var topo = nodeSet.topology();
                topo.tooltipManager().openNodeSetTooltip(nodeSet);
            }
        }
    });


    nx.define('NodeSetScene', nx.graphic.Topology.DefaultScene, {
        'properties': {
            'previousNodeSet': undefined
        },
        'methods': {
            'clickNodeSet': function(sender, nodeSet) {
                // assign a custom tooltip policy class to process events
                sender.tooltipManager().tooltipPolicyClass('CustomTooltipPolicy');
            },
            'beforeExpandNodeSet': function(sender, nodeSet) {
                if (this.previousNodeSet()) {
                    this.previousNodeSet().collapse(false);
                }
                this.inherited(sender, nodeSet);
                this.previousNodeSet(nodeSet);
            }
        }
    });

    // next-ui demos
    nx.define("ExtendedNode", nx.graphic.Topology.Node, {
        view: function(view){

            view.content.push({
                "name": "deviceDownBadge",
                "type": "nx.graphic.Group",
                props: {
                    // 'class': ['panel-body createpanel ','{#model.panelClass}','{#model.selectMode}']
                },
                "content": [
                    {
                        "name": "deviceDownBadgeBg",
                        "type": "nx.graphic.Rect",
                        "props": {
                            "class": "device-down-bg",
                            "height": 1,
                            "visible": false
                        }
                    },
                    {
                        "name": "deviceDownBadgeText",
                        "type": "nx.graphic.Icon",
                        "props": {
                            "class": "icon",
                            "iconType": "devicedown",
                            "color": "#ff0000",
                            "showIcon": true,
                            "scale": 1,
                            "visible": false
                        }
                    }
                ]
            });
            return view;
        },
        methods: {
            // inherit properties/parent"s data
            "init": function(args){
                this.inherited(args);
                var stageScale = this.topology().stageScale();
                this.view("label").setStyle("font-size", 14 * stageScale);
            },
            // inherit parent"s model
            "setModel": function(model) {
                this.inherited(model);

                // if status is down
                if( this.model().get("status") == "down" ) {
                    this._drawDeviceDownBadge();
                }
            },
            "_drawDeviceDownBadge": function(){

                var badge, badgeBg, badgeText,
                    icon, iconSize, iconScale,
                    bound, boundMax, badgeTransform;

                // views of badge
                badge = this.view("deviceDownBadge");
                badgeBg = this.view("deviceDownBadgeBg");
                badgeText = this.view("deviceDownBadgeText");

                // view of device icon
                icon = this.view('icon');
                iconSize = icon.size();
                iconScale = icon.scale();

                // define position of the badge
                badgeTransform = {
                    x: iconSize.width * iconScale / 4,
                    y: iconSize.height * iconScale / 4
                };

                // make badge visible
                badgeText.set("visible", true);

                // get bounds and apply them for white background
                bound = badge.getBound();
                boundMax = Math.max(bound.width - 6, 1);
                badgeBg.sets({
                    width: boundMax,
                    visible: true
                });

                // set position of the badge
                badgeBg.setTransform(badgeTransform.x, badgeTransform.y);
                badgeText.setTransform(badgeTransform.x, badgeTransform.y);

            }
        }
    });

    nx.define("lynx.BorderGroup", nx.graphic.Topology.RectGroup, {
        properties: {
            
        },
        methods: {
            // draw: function() {
            //     this.inherited();
            //     this.setTransform(0, 0);

            //     var topo = this.topology();
            //     var stageScale = topo.stageScale();
            //     var translate = {
            //         x: topo.matrix().x(),
            //         y: topo.matrix().y()
            //     };


            //     var vectorArray = [];
            //     nx.each(this.getNodes(), function(node) {
            //         if (node.visible()) {
            //             vectorArray.push({
            //                 x: node.model().x(),
            //                 y: node.model().y()
            //             });
            //         }
            //     });
            //     var min = {
            //         x: vectorArray[0].x || 999,
            //         y: vectorArray[0].y || 999,
            //         xi: 0,
            //         yi: 0
            //     };
            //     var max = {
            //         x: 0,
            //         y: 0,
            //         xi: 0,
            //         yi: 0
            //     };
            //     nx.each(vectorArray, function (pos, index) {
            //         if (pos.x < min.x) {
            //             min.x = pos.x;
            //             min.xi = index;
            //         }
            //         if (pos.y < min.y) {
            //             min.y = pos.y;
            //             min.yi = index;
            //         }
            //         if (pos.x > max.x) {
            //             max.x = pos.x;
            //             max.xi = index;
            //         }
            //         if (pos.y > max.y) {
            //             max.y = pos.y;
            //             max.yi = index;
            //         }
            //     });
            //     vectorArray[min.xi].x = vectorArray[min.xi].x - 50;
            //     vectorArray[min.yi].y = vectorArray[min.yi].y - 50;
            //     vectorArray[max.xi].x = vectorArray[max.xi].x + 50;
            //     vectorArray[max.yi].y = vectorArray[max.yi].y + 50;
                
            //     var shape = this.view('shape');
            //     shape.sets({
            //         style: 'fill:transparent;stroke:#EEE;stroke-width:5px'
            //     });
            //     shape.dom().setStyle('stroke', '#EEE');
            //     shape.dom().setStyle('stroke-width', '5px');

            //     shape.nodes(vectorArray);

            //     var bound = topo.getInsideBound(shape.getBound());
            //     bound.left -= translate.x;
            //     bound.top -= translate.y;
            //     bound.left *= stageScale;
            //     bound.top *= stageScale;
            //     bound.width *= stageScale;
            //     bound.height *= stageScale;

            //     //                this.view('bg').sets({
            //     //                    x: bound.left,
            //     //                    y: bound.top,
            //     //                    width: bound.width,
            //     //                    height: bound.height
            //     //                });

            //     var minus = this.view('minus');
            //     var label = this.view('label');
            //     var nodeIcon = this.view('nodeIcon');
            //     var nodeIconImg = this.view('nodeIconImg');
            //     var labelContainer = this.view('labelContainer');


            //     if (topo.showIcon() && topo.revisionScale() > 0.6) {

            //         // shape.dom().setStyle('stroke-width', '5px');


            //         nodeIconImg.set('iconType', this.nodeSet().iconType());
            //         //                    nodeIconImg.set('color', this.color());

            //         var iconSize = nodeIconImg.size();

            //         nodeIcon.visible(true);

            //         if (nx.util.isFirefox()) {
            //             minus.setTransform(bound.left + bound.width / 2, bound.top - iconSize.height * stageScale / 2 + 8 * stageScale, 1 * stageScale);
            //             nodeIcon.setTransform(bound.left + bound.width / 2 + 3 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2 - 0 * stageScale, 0.5 * stageScale);


            //         } else {
            //             minus.setTransform(bound.left + bound.width / 2, bound.top - iconSize.height * stageScale / 2 - 22 * stageScale, 1 * stageScale);
            //             nodeIcon.setTransform(bound.left + bound.width / 2 + 3 * stageScale + iconSize.width * stageScale / 2, bound.top - iconSize.height * stageScale / 2 - 22 * stageScale, 0.5 * stageScale);
            //         }




            //         label.sets({
            //             x: bound.left + bound.width / 2 - 3 * stageScale + iconSize.width * stageScale,
            //             y: bound.top - iconSize.height * stageScale / 2 - 22 * stageScale
            //         });
            //         label.view().dom().setStyle('font-size', 16 * stageScale);
            //         //                    labelContainer.view().dom().setStyle('fill', this.color());

            //     } else {

            //         // shape.dom().setStyle('stroke-width', '5px');

            //         if (nx.util.isFirefox()) {
            //             minus.setTransform(bound.left + bound.width / 2, bound.top - 29 * stageScale / 2, stageScale);
            //         } else {
            //             minus.setTransform(bound.left + bound.width / 2, bound.top - 45 * stageScale / 2, stageScale);
            //         }

            //         nodeIcon.visible(false);

            //         label.sets({
            //             x: bound.left + bound.width / 2 + 12 * stageScale,
            //             y: bound.top - 45 * stageScale / 2
            //         });
            //         label.view().dom().setStyle('font-size', 16 * stageScale);

            //     }


            //     //                this.view('minusIcon').color(this.color());

            // }
            draw: function () {
                this.inherited();
                this.setTransform(0, 0);

                var topo = this.topology();
                var stageScale = topo.stageScale();
                var revisionScale = topo.revisionScale();
                var translate = {
                    x: topo.matrix().x(),
                    y: topo.matrix().y()
                };
                var bound = topo.getBoundByNodes(this.getNodes());
                if (bound == null) {
                    return;
                }
                bound.left -= translate.x;
                bound.top -= translate.y;
                var shape = this.view('shape');
                shape.sets({
                    x: bound.left,
                    y: bound.top,
                    width: bound.width,
                    height: bound.height,
                    fill: 'transparent',
                    stroke: 'red',
                    scale: topo.stageScale()
                });


                var text = this.view('text');


                text.setTransform((bound.left + bound.width / 2) * stageScale, (bound.top - 12) * stageScale, stageScale);
                text.view().dom().setStyle('fill', this.color());

                this.view('label').view().dom().setStyle('font-size', 11);
            }
        }
    });

})(nx);

window.onload = function () {
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
            "target": 1
        }, {
            "source": 1,
            "target": 2
        }, {
            "source": 1,
            "target": 3
        }, {
            "source": 4,
            "target": 1
        }, {
            "source": 2,
            "target": 3
        }, {
            "source": 2,
            "target": 0
        }, {
            "source": 0,
            "target": 4
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }, {
            "source": 0,
            "target": 3
        }],
        nodeSet: [{
            id: 5,
            type: 'nodeSet',
            nodes: [0, 2, 3],
            root: '2',
            "x": 660,
            "y": 190,
            "name": "Node set 1",
            iconType: 'router'
        }]
    };
    var app = new nx.ui.Application();
    app.container(document.getElementById('topologyPanel'));
    var topology = new nx.graphic.Topology({
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
    topology.getLayer('groups').registerGroupItem('nodeSetPolygon', 'lynx.BorderGroup');
    topology.data(topologyData);
    topology.attach(app);
};