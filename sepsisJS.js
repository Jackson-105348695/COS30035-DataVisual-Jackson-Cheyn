//Version 5
//Added Average line
//Added gradient to charts
//Added a country filter
//Fixed Numbers being displayed
//Corrected the direction of the numbers
//y and hight where doing what the other was supposed to do that has now been corrected
//Centered text inside of bar
//Changed the high of the average text as when using country filter text would be outside of svg meaning it is not displayed

//Setting width and hight variables
var w = 1200;
var h = 300;

//Setting base sort number to 1 to say not to sort data
sortNum = 1;

//Imports csv data defining 3 pieces of data then loading it into the variable dataset
d3.csv("sepsis_30day_data.csv", function(d)
{
    return {
        Country: d.Reference,
        date: +d.TIME_PERIOD,
        number: +d.OBS_VALUE
    };
}).then(function(data)
{
    dataset = data;
    maindata = dataset;
    barChart(dataset);
});

function barChart(data)
{
    if (sortNum == 2) //Checks what sort function we are using (Country)
    {
        var xscale = d3.scaleBand() //Creating and loading data onto the x axis and specifying spacing
                        .domain(data.map(d => d.Country))
                        .rangeRound([0,w])
                        .paddingInner(0.05);
    }

    else if (sortNum == 3) //Checks what sort function we are using (Year)
    {
        var xscale = d3.scaleBand() //Creating and loading data onto the x axis and specifying spacing
                        .domain(data.map(d => d.date))
                        .rangeRound([0,w])
                        .paddingInner(0.05);
    }

    else
    {
        var xscale = d3.scaleBand() //Creating and loading data onto the x axis and specifying spacing
                        .domain(d3.range(data.length))
                        .rangeRound([0,w])
                        .paddingInner(0.05);
    }

    //Create a colour gradient from blue to red
    colorScale = d3.scaleLinear()
                    .domain([0, d3.max(data, d => d.number)])
                    .range(["blue", "red"]);

    //Loads data onto y scale
    var yscale = d3.scaleLinear() 
                    .domain([0, d3.max(data, d => d.number)]) 
                    .range([h, 0]);

    //Formats x axis
    var xaxis = d3.axisBottom()
                .ticks(5)
                .scale(xscale);

    //Formats y axis
    var yaxis = d3.axisLeft()
                .ticks(5)
                .scale(yscale);

    //Creates svg onto webpage
    var svg = d3.select("#chart")
                    .append("svg")
                    .attr("width", w +60) //+60 gives space for the axis
                    .attr("height", h + 40) //+40 gives space for axis

    //Creates x axis
    svg.append("g")
        .attr("transform", "translate(40, "+ (h +10) +")")
        .call(xaxis);

    //Creates y axis
    svg.append("g")
        .attr("transform", "translate("+ (40) + ", 10)")
        .call(yaxis);

    //editing svg
    svg.selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("x", function(d, i)
        {
            if (sortNum == 2) //Checks what sort function we are using (Country)
            {
                return xscale(d.Country) +40; //Applies x scale
            }

            else if (sortNum == 3) //Checks what sort function we are using (year)
            {
                return xscale(d.date) +40; //Applies x scale
            }

            else
            {
                return xscale(i) +40; //Applies x scale
            }
            
        })
        .attr("y", function(d)
        {
            return yscale(d.number) +10; //Applies y scale
        })
        .attr("width", xscale.bandwidth()) //Adjust width of bars to fit all data in svg
        .attr("height", function(d)
        {
            return h - yscale(d.number); //adjust hight of bars to fit in svg
        })
        .attr("fill", d => colorScale(d.number)) //Sets colour of bars to black
        .on('mouseover', function(d, i) //This function applies when you mouse is hovered over a specific bar in the graph
        {
            d3.select(this)
                .attr("fill", "orange"); //Sets colour of bar to orange when hovering over
                
                var box = this.getBBox();
                svg.append("text") //Writes variable onto the bar as well as centres the text on the bar
                    .attr("id", "tooltip")
                    .attr("x", box.x + box.width / 1.5)
                    .attr("y", box.y + box.height / 2.4)
                    .attr("transform", "rotate(-90 " + (box.x + box.width / 1.5) + " " + (box.y + box.height / 2.4) + ")")
                    .text(d.number);
        })
        .on('mouseout', function(event, d) //This function sets it so when the mouse is no longer hovering over the bar it will revert back to black and remove the text
        {
            d3.select(this)
                .attr("fill", d => colorScale(d.number))
                d3.select("#tooltip").remove();
        })

    average = d3.mean(data, d=> d.number); //Creates an average of all the data
    
    //Draws a red line showing the average
    svg.append("line")
        //start of line
        .attr("x1", 40)
        .attr("y1", yscale(average) + 10)
        //end of line
        .attr("x2", w + 40)
        .attr("y2", yscale(average) + 10)
        //colour and width
        .attr("stroke", "black")
        .attr("stoke-width", 2);

    //Creates text displaying the average
    svg.append("text")
        .attr("x", w - 50)
        .attr("y", yscale(average))
        .attr("fill", "black")
        .style("font-size", "12px")
        .text("Average: " + average.toFixed(2)); //round to 2 decimal points
}

//This next section is for when one of the buttons is pressed the data on screen will react
function button(num)
{
    if (num == 1) //30 Days dataset SVG
    {
        d3.csv("sepsis_30day_data.csv", function(d)
        {
            return {
                Country: d.Reference,
                date: +d.TIME_PERIOD,
                number: +d.OBS_VALUE
            };
        }).then(function(data)
        {
            dataset = data;
            maindata = dataset;
            d3.select("#chart").selectAll("*").remove();
            barChart(dataset);
        });
    }

    if (num == 2) //Hospital dataset SVG
    {
        d3.csv("sepsis_hospital_data.csv", function(d)
        {
            return {
                Country: d.Reference,
                date: +d.TIME_PERIOD,
                number: +d.OBS_VALUE
            };
        }).then(function(data)
        {
            dataset = data;
            maindata = dataset;
            d3.select("#chart").selectAll("*").remove();
            barChart(dataset);
        });
    }

    if (num == 3) //Individual Sort
    {
        sortNum = 1; //Allows barChart to know what sort we are using
        d3.select("#chart").selectAll("*").remove();
        barChart(dataset, sortNum);
    }

    if (num == 4) //Country Sort
    {
        sortNum = 2; //Allows barChart to know what sort we are using
        d3.select("#chart").selectAll("*").remove();
        barChart(dataset, sortNum);
    }

    if (num == 5) //Year sort
    {
        sortNum = 3; //Allows barChart to know what sort we are using
        dataset.sort((a, b) => b.date - a.date);
        d3.select("#chart").selectAll("*").remove();
        barChart(dataset, sortNum);
    }

    if (num == 6) //High to low sort
    {
        dataset.sort((a, b) => b.number - a.number);
        d3.select("#chart").selectAll("*").remove();
        barChart(dataset);
    }
}

//country filter so you can view specific countries data
function countryFilter(countryName)
{
    if (countryName == "all")
    {
        dataset = maindata; //imports all countries back to normal dataset
    }
    else
    {
        dataset = maindata.filter(d => d.Country == countryName); //Filters only specific country name
    }

    d3.select("#chart").selectAll("*").remove();
        barChart(dataset);
}