//d3.json("test.json", function (treefam_data) {

     
var pie5NetworkSize;
var rootChart;
// var familiesBubbleChart  = dc.bubbleChart("#families-bubble-chart"); 
//var familieslineChart  = dc.lineChart("#chart-line-families"); 
var fluctuationChart;
var conservationChart;
var speciesCountChart;
var modelOrganismChart;
var domainCoverageChart;
var mouseGenesChart;
var humanGenesChart;
var zebrafishChart;

var moveChart;
var volumeChart;


// d3.json("treefam9_families.json", function (treefam_data) {
d3.json("all_tf9_fams.json", function (treefam_data) {


function print_filter(filter) {
    var f = eval(filter);
    if (typeof (f.length) != "undefined") {} else {}
    if (typeof (f.top) != "undefined") {
        f = f.top(Infinity);
    } else {}
    if (typeof (f.dimension) != "undefined") {
        f = f.dimension(function (d) {
            return "";
        }).top(Infinity);
    } else {}
    console.log(filter + "(" + f.length + ") = " + JSON.stringify(f).replace("[", "[\n\t").replace(/}\,/g, "},\n\t").replace("]", "\n]"));
}
function getvalues(d){
    var str=d.key.getDate() + "/" + (d.key.getMonth() + 1) + "/" + d.key.getFullYear()+"\n";
    var key_filter = dateDim.filter(d.key).top(Infinity);
    var total=0
    key_filter.forEach(function(a) {
        str+=a.status+": "+a.hits+" Hit(s)\n";
        total+=a.hits;
    });

    str+="Total:"+total;
    //remove filter so it doesn't effect the graphs,
    //this is the only filter so we can do this
    dateDim.filterAll();
    return str;
} 
Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};


var data = [
        {date: "12/27/2012", http_404: 2, http_200: 190, http_302: 100},
        {date: "12/28/2012", http_404: 2, http_200: 10, http_302: 100},
        {date: "12/29/2012", http_404: 1, http_200: 300, http_302: 200},
        {date: "12/30/2012", http_404: 2, http_200: 90, http_302: 0},
        {date: "12/31/2012", http_404: 2, http_200: 90, http_302: 0},
        {date: "01/01/2013", http_404: 2, http_200: 90, http_302: 0},
        {date: "01/02/2013", http_404: 1, http_200: 10, http_302: 1},
        {date: "01/03/2013", http_404: 2, http_200: 90, http_302: 0},
        {date: "01/04/2013", http_404: 2, http_200: 90, http_302: 0},
        {date: "01/05/2013", http_404: 2, http_200: 90, http_302: 0},
        {date: "01/06/2013", http_404: 2, http_200: 200, http_302: 1},
        {date: "01/07/2013", http_404: 1, http_200: 200, http_302: 100}
        ];


        
pie5NetworkSize = dc.pieChart("#pie5NetworkSize");
 rootChart = dc.rowChart("#org-chart");
// var familiesBubbleChart  = dc.bubbleChart("#families-bubble-chart"); 
//var familieslineChart  = dc.lineChart("#chart-line-families"); 
 fluctuationChart = dc.barChart("#fluctuation-chart");
 conservationChart = dc.barChart("#conservation-chart");
 modelOrganismChart = dc.rowChart("#modelOrganism_chart");
 //domainCoverageChart = dc.barChart("#domain_coverage-chart");

 speciesCountChart = dc.barChart("#species_count-chart");
 
    mouseGenesChart = dc.barChart("#mouse_genes-chart");
    humanGenesChart = dc.barChart("#human_genes-chart");
    zebrafishChart = dc.barChart("#zebrafish_genes-chart");

    moveChart = dc.lineChart("#monthly-move-chart");
    volumeChart = dc.barChart("#monthly-volume-chart");

// var treefam_data = [
// {"modelName":"TF105088", "hgncSymbol":"CYP4", "geneCount":1362, "percentIdentity":33,"alnLength":7343,"rootTaxon":"Eukaryota","description":"cytochrome P450, family 4", "function_cat": "A", 
//     "modelOrganism" :{"human": 3, "mouse" : 4}, "modelOrga" : "Mouse"},
// {"modelName":"TF105310", "hgncSymbol":"WNT", "geneCount":289, "percentIdentity":53,"alnLength":4109,"rootTaxon":"Metazoa","description":"wingless-type MMTV integration site family", "function_cat": "B", "modelOrganism" :{"human": 3, "mouse" : 0}, "modelOrga" : "Human"},
// {"modelName":"TF105312", "hgncSymbol":"WNTA", "geneCount":589, "percentIdentity":13,"alnLength":4109,"rootTaxon":"Metazoa","description":"wingless-type MMTV integration site family", "function_cat": "B", "human_genes": 3, "mouse_genes":4, "modelOrga" : "Human&Mouse"},
// {"modelName":"TF105313", "hgncSymbol":"WNTA", "geneCount":189, "percentIdentity":23,"alnLength":4109,"rootTaxon":"Vertebrates","description":"wingless-type MMTV integration site family", "function_cat": "B", "human_genes": 2, "mouse_genes":0, "modelOrga" : "Human&Mouse"},
// {"modelName":"TF105314", "hgncSymbol":"WNTA", "geneCount":589, "percentIdentity":53,"alnLength":4109,"rootTaxon":"Metazoa","description":"wingless-type MMTV integration site family", "function_cat": "B", "human_genes": 3, "mouse_genes":3, "modelOrga" : "Human&Mouse"},
// {"modelName":"TF105315", "hgncSymbol":"WNTA", "geneCount":789, "percentIdentity":93,"alnLength":4109,"rootTaxon":"Vertebrates","description":"wingless-type MMTV integration site family", "function_cat": "C", "human_genes": 0, "mouse_genes":2, "modelOrga" : "Human"},
// {"modelName":"TF105315", "hgncSymbol":"WNTA", "geneCount":789, "percentIdentity":93,"alnLength":4109,"rootTaxon":"Human","description":"wingless-type MMTV integration site family", "function_cat": "C", "human_genes": 0, "mouse_genes":2, "modelOrga" : "Human"},
// ];

var ndx_treefam = crossfilter(treefam_data); 
var modelDim  = ndx_treefam.dimension(function(d) {return d.geneCount;});
//print_filter("modelDim");    

var functionDim = modelDim.group().reduceSum(function (d) {return d.alnLength;});
//print_filter("functionDim");    

var max_gene_count = d3.max(treefam_data, function(d) { return +d.geneCount;} );
var max_conservation = d3.max(treefam_data, function(d) { return +d.percentIdentity;} );
var max_coverage = d3.max(treefam_data, function(d) { return +d.coverage;} );

var max_human_genes = d3.max(treefam_data, function(d) { return +d.human_genes;} );
var max_mouse_genes = d3.max(treefam_data, function(d) { return +d.mouse_genes;} );

var max_root_taxa = d3.max(treefam_data, function(d) { return +d.rootTaxon;} );
var max_speciesCount = d3.max(treefam_data, function(d) { return +d.speciesCount;} );

var count_families = 0;

treefam_data.forEach(function(d,i){

    if(Number(d.percentIdentity) == 0 || isNaN(Number(d.percentIdentity))){ d.percentIdentity_t = "?"; }
        else if(Number(d.percentIdentity) < 30) { d.percentIdentity_t = "slow"; }
        else if(Number(d.percentIdentity) >= 30 && Number(d.percentIdentity) < 60) { d.percentIdentity_t = "medium"; }
        else if(Number(d.percentIdentity) >= 60) { d.percentIdentity_t = "fast"; }
    // put into gene size bin
        if(d.geneCount){ d.numberClass = Math.round(d.geneCount *  100 / max_gene_count); }

        d.domain_coverage = Math.floor(Math.random() * 100) + 1;

        var species_array = ["human", "mouse", "zebrafish", "plant"];
        d.modelOrganism = species_array[Math.floor(Math.random() * 4) ];
        d.modelOrga = new Array();
        ["human_genes", "mouse_genes", "zebrafish_genes", "plant_genes"].map(function(item){
            if(item === undefined || item === "undefined"){return}
            if(d[item] && d[item] >0 ){ d.modelOrga.push({ name : d[item] }); }
            
        });
        d.percentIdentity = Math.floor(d.percentIdentity);

        count_families++;
});
// set number of families
jQuery("#total_families").text(count_families);

var all = ndx_treefam.groupAll();

dc.dataCount(".dc-data-count")
        .dimension(ndx_treefam)
        .group(all);


var count_percentIdentityDimension = ndx_treefam.dimension(function(d){ return d.percentIdentity_t; });
var count_percentIdentityGroup = count_percentIdentityDimension.group();

pie5NetworkSize.width(90).height(90).radius(40).dimension(count_percentIdentityDimension).group(count_percentIdentityGroup).minAngleForLabel(0);

var conservation = ndx_treefam.dimension(function (d) {return d.percentIdentity;});
var conservationGroup = conservation.group();


conservationChart.width(350)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(conservation)
        .group(conservationGroup)
        //.elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_conservation]))
        .x(d3.scale.linear().domain([0,100]))
        .xAxisLabel('% of alignment conservation')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

var speciesCount_dim = ndx_treefam.dimension(function (d) {return d.speciesCount;});
var speciesCountGroup = speciesCount_dim.group();


speciesCountChart.width(350)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(speciesCount_dim)
        .group(speciesCountGroup)
        //.elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        .alwaysUseRounding(true)
        //.x(d3.scale.linear().domain([0,max_conservation]))
        .x(d3.scale.linear().domain([0,max_speciesCount]))
        .xAxisLabel('Number of species')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true);

// human genes
var humanGenes_dim = ndx_treefam.dimension(function (d) {return d.human_genes; });
var humanGenes_grp = humanGenes_dim.group();
humanGenesChart.width(250)
        .height(200)
        //.margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(humanGenes_dim)
        .group(humanGenes_grp)
        //.elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        //.round(dc.round.floor)
        //.alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_human_genes+1]))
        .xAxisLabel('% of alignment conservation')
        .yAxisLabel('Number of Human genes')
        //.renderHorizontalGridLines(true);

// mouse genes
var mouseGenes_dim = ndx_treefam.dimension(function (d) {return d.mouse_genes;});
var mouseGenes_grp = mouseGenes_dim.group();
mouseGenesChart.width(250)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(mouseGenes_dim)
        .group(mouseGenes_grp)
        //.elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_mouse_genes+1]))
        .xAxisLabel('% of alignment conservation')
        .yAxisLabel('Number of Mouse genes')
        .renderHorizontalGridLines(true);


var zebrafishGenes_dim = ndx_treefam.dimension(function (d) {return d.zebrafish_genes;});
var zebrafishGenes_grp = zebrafishGenes_dim.group();
zebrafishChart.width(250)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(zebrafishGenes_dim)
        .group(zebrafishGenes_grp)
        //.elasticY(true)
        //.elasticX(true)
        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        .centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        //.gap(1)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_mouse_genes+1]))
        .xAxisLabel('% of alignment conservation')
        .yAxisLabel('Number of Zebrafish genes')
        .renderHorizontalGridLines(true);


moveChart
        .renderArea(true)
        .width(600)
        .height(200)
        .transitionDuration(1000)
        .margins({top: 30, right: 50, bottom: 25, left: 40})
        .dimension(humanGenes_dim)
        //.mouseZoomable(true)
        // Specify a range chart to link the brush extent of the range with the zoom focue of the current chart.
        .rangeChart(volumeChart)
        .x(d3.scale.linear().domain([0,30]))
        //.round(d3.time.month.round)
        //.xUnits(d3.time.months)
        .elasticY(true)
        //.renderHorizontalGridLines(true)
        .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
        .brushOn(false)
        // Add the base layer of the stack with group. The second parameter specifies a series name for use in the legend
        // The `.valueAccessor` will be used for the base layer
        .group(humanGenes_grp, "Human genes")
          .valueAccessor(function (d) {
             return d.value;
          })
        // stack additional layers with `.stack`. The first paramenter is a new group.
        // The second parameter is the series name. The third is a value accessor.
        .stack(mouseGenes_grp, "Mouse genes", function (d) {
             return d.value;
         })
        .stack(zebrafishGenes_grp, "Mouse genes", function (d) {
             return d.value;
         })
        // .stack(humanGenes_dim, "Mouse genes", function (d) {
        //      return d.value;
        //  })

        // .stack(humanGenes_grp, "Human genes", function (d) {
        //      return d.value;
        //  })
        // title can be called by any stack layer.
        // .title(function (d) {
        //     var value = d.value.avg ? d.value.avg : d.value;
        //     if (isNaN(value)) value = 0;
        //     return dateFormat(d.key) + "\n" + numberFormat(value);
        // })
        .xAxisLabel('No of model organism genes')
        .yAxisLabel('No of families')
        ;


volumeChart.width(600)
        .height(90)
        .margins({top: 0, right: 50, bottom: 20, left: 40})
        .dimension(humanGenes_dim)
        .group(humanGenes_grp)
        .centerBar(true)
        .gap(1)
        .x(d3.scale.linear().domain([0,30]))
        //.round(d3.time.month.round)
        //.alwaysUseRounding(true)
        //.xUnits(d3.time.months)
        ;

// domain coverage

// var domain_coverage = ndx_treefam.dimension(function (d) {return d.domain_coverage;});
// var domainCoverageGroup = domain_coverage.group();

// domainCoverageChart.width(350)
//         .height(200)
//         .margins({top: 10, right: 50, bottom: 30, left: 40})
//         .dimension(domain_coverage)
//         .group(domainCoverageGroup)
//         .elasticY(true)
//         // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
//         .centerBar(true)
//         // (optional) set gap between bars manually in px, :default=2
//         .gap(1)
//         // (optional) set filter brush rounding
//         .round(dc.round.floor)
//         .alwaysUseRounding(true)
//         .x(d3.scale.linear().domain([0,100]))
//         .xAxisLabel('% pfam residue coverage')
//         .yAxisLabel('Number of families')
//         .renderHorizontalGridLines(true)


var diff_root = new Object();
var rootTaxon_dim = ndx_treefam.dimension(function (d) {
    diff_root[d.rootTaxon] = 1;
    return d.rootTaxon;
});
var no_root_taxa = Object.size(diff_root);
var rootChartHight = Math.max(no_root_taxa * 40, 100);
var rootTaxon_grp = rootTaxon_dim.group();
//var rootTaxon_heigth = rootTaxon_grp.length();
rootChart.width(280) // (optional) define chart width, :default = 200
                .height(rootChartHight) // (optional) define chart height, :default = 200
                .transitionDuration(750)
                .dimension(rootTaxon_dim) // set dimension
                .group(rootTaxon_grp) // set group
                .renderLabel(true)
                .elasticX(true)
                .labelOffsetX(1)
                .x(d3.scale.linear().domain([0,max_root_taxa+10]))
                //.xAxisLabel('Number of families')
                .margins({top: 20, left: 10, right: 10, bottom: 20});




var modelOrganism_dim = ndx_treefam.dimension(function (d) {return d.modelOrganism;});
var modelOrganism_grp = modelOrganism_dim.group();
modelOrganismChart.width(280) // (optional) define chart width, :default = 200
                .height(200) // (optional) define chart height, :default = 200
                .dimension(modelOrganism_dim) // set dimension
                .group(modelOrganism_grp) // set group
                .elasticX(true)
                .labelOffsetX(1)
                //.xAxisLabel('Number of families')
                .margins({top: 20, left: 10, right: 10, bottom: 20});

var sizeDim = ndx_treefam.dimension(function(d) {return d.geneCount;});
var percentDim = sizeDim.group().reduceSum(function(d) {return d.percentIdentity;}); 

var max_size = d3.max(treefam_data, function(d) { return d.geneCount;  });
var min_size = d3.min(treefam_data, function(d) { return d.geneCount;  });

// familiesBubbleChart
//         .width(600) // (optional) define chart width, :default = 200
//         .height(250)  // (optional) define chart height, :default = 200
//         .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
//         .margins({top: 10, right: 50, bottom: 30, left: 40})
//         .dimension(sizeDim)
//         //Bubble chart expect the groups are reduced to multiple values which would then be used
//         //to generate x, y, and radius for each key (bubble) in the group
//         .group(percentDim)
//         .colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
//         .colorDomain([-500, 500]) //(optional) define color domain to match your data domain if you want to bind data or color
//         //Accessor functions are applied to each value returned by the grouping
//         //
//         //* `.colorAccessor` The returned value will be mapped to an internal scale to determine a fill color
//         //* `.keyAccessor` Identifies the `X` value that will be applied against the `.x()` to identify pixel location
//         //* `.valueAccessor` Identifies the `Y` value that will be applied agains the `.y()` to identify pixel location
//         //* `.radiusValueAccessor` Identifies the value that will be applied agains the `.r()` determine radius size, by default this maps linearly to [0,100]
//         .colorAccessor(function (d) {
//             if(d.rootTaxon === "Eukaryota"){
//                 return 1;
//             }
//             else{
//                 return 0;
//             }
//             return d.value.absGain;
//         })
//         //.maxBubbleRelativeSize(0.3)
//         .x(d3.scale.linear().domain([0, max_gene_count]))
//         .y(d3.scale.linear().domain([0, 110]))
//         //.r(d3.scale.linear().domain([0, 4]))
//         .radiusValueAccessor(function(d) {
//                     return 0.0003;
//                     })
//         //.elasticY(true)
//         //.elasticX(true)
//         .label(function (p) {
//             return p.value;
//         })
//         .xAxisLabel('Gene members') // (optional) render an axis label below the x axis
//         .yAxisLabel('Alignment conservation') // (optional) render an axis label below the x axis
// ;

var datatable   = dc.dataTable("#dc-data-familiestable");
datatable
    .dimension(sizeDim)
    .group(function(d) {return d.geneCount;})
    .columns([
        function(d) { return d.modelName },
        function(d) {return d.geneCount;},
        function(d) {return d.alnLength;},
        function(d) {return d.percentIdentity;},        
        function(d) {return d.rootTaxon;},
        function(d) {return d.coverage;}
    ]);


var fluctuation = ndx_treefam.dimension(function (d) {
        return d.geneCount;
    });
var fluctuationGroup = fluctuation.group();
fluctuationChart.width(700)
        .height(200)
        .margins({top: 10, right: 50, bottom: 30, left: 40})
        .dimension(fluctuation)
        .group(fluctuationGroup)
        .elasticY(true)

        // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
        //.centerBar(true)
        // (optional) set gap between bars manually in px, :default=2
        .gap(1)
        // (optional) set filter brush rounding
        .round(dc.round.floor)
        .alwaysUseRounding(true)
        .x(d3.scale.linear().domain([0,max_gene_count+20]))
        .xAxisLabel('Family size')
        .yAxisLabel('Number of families')
        .renderHorizontalGridLines(true)
        // customize the filter displayed in the control span
        //.filterPrinter(function (filters) {
        //    var filter = filters[0], s = "";
        //    s += numberFormat(filter[0]) + "% -> " + numberFormat(filter[1]) + "%";
        //    return s;
        //        })
;



dc.renderAll(); 

window.rootfilter = function(filters) {
    rootChart.filter('Vertebrata');
    dc.renderAll();
  };

// window.familiesfilter = function(filters) {
//     fluctuationChart.filter([100,109]);
//     dc.renderAll();
//   };

// window.alignmentfilter = function(filters) {
//     conservationChart.filter([80,100]);
//     dc.renderAll();
//   };

});


// reset all charts
function reset() {
    fluctuationChart.filterAll();
    rootChart.filterAll();
    conservationChart.filterAll();
    modelOrganismChart.filterAll();
    domainCoverageChart.filterAll();
    pie5NetworkSize.filterAll();
    dc.redrawAll();
};



// function rootfilter(filters) {
//     reset();
//     for (var i = 0; i < filters.length; i++) {
//         rootChart.filter(filters[i]);   
//     }
//     dc.redrawAll();
// }

function familiesfilter(filters) {
    reset();
    for (var i = 0; i < filters.length; i++) {
        fluctuationChart.filter(filters[i]);   
    }
    dc.redrawAll();
}


function alignmentfilter(filters) {
    reset();
    for (var i = 0; i < filters.length; i++) {
        conservationChart.filter(filters[i]);   
    }
    dc.redrawAll();
}


