import Shader from "./shader.js";
import vertexShaderSrc from "./vertex.js";
import fragmentShaderSrc from "./fragment.js";
import Renderer from "./renderer.js";
import Square from "./square.js";
import Rectangle from "./rectangle.js";

const renderer = new Renderer();
const gl = renderer.webglcontext();

const shader = new Shader(gl, vertexShaderSrc, fragmentShaderSrc);
shader.use();

let mode = 0;
let shape = "s";
let primitive_array = [];
let coordinates = [];
let recentidx = -1;
let rotation = 0;
let deleted = [];

window.onload = () => {
     renderer.getcanvas().addEventListener("click", (event) => {
        let mouseX = event.clientX;
        let mouseY = event.clientY;

        const clipCoordinates = renderer.mouseToClipCoord(mouseX, mouseY);

        if (mode == 0) 
        {
            if (shape == "r") 
            {
                coordinates.push(clipCoordinates);
                primitive_array.push(new Rectangle(gl, clipCoordinates[0], clipCoordinates[1]));
            } 

            else if (shape == "s") 
            {
                coordinates.push(clipCoordinates);
                primitive_array.push(new Square(gl, clipCoordinates[0], clipCoordinates[1]));

            } 
        }


        else if (mode == 1)
        {
            if (recentidx != -1) 
            {
                primitive_array[recentidx].color = "default";
            }

            let new_coordinates = [...primitive_array];
            new_coordinates.sort((a, b) => ((a.coordinates[0] - clipCoordinates[0]) ** 2 + (a.coordinates[1] - clipCoordinates[1]) ** 2) - ((b.coordinates[0] - clipCoordinates[0]) ** 2 + (b.coordinates[1] - clipCoordinates[1]) ** 2))

            primitive_array.forEach(function(s, idx) {
                let xmin = Infinity;
                let xmax = -Infinity;
                let ymin = Infinity;
                let ymax = -Infinity;
 

                let array = Array.from(s.vertexAttributesData);
                let x_array = [array[0], array[3], array[6], array[9]];
                let y_array = [array[1], array[4], array[7], array[10]];
                xmin = Math.min(xmin, Math.min(...x_array));
                xmax = Math.max(xmax, Math.max(...x_array));
                ymin = Math.min(ymin, Math.min(...y_array));
                ymax = Math.max(ymax, Math.max(...y_array));
                if (xmin<=clipCoordinates[0]  && clipCoordinates[0]<=xmax && ymin <=clipCoordinates[1] && clipCoordinates[1] <=ymax) 
                {
                    let a1 = s.coordinates;
                    let a2 = new_coordinates[0].coordinates;

                    if(JSON.stringify(a1) == JSON.stringify(a2))
                    {
                        recentidx = idx;
                        primitive_array[recentidx].color = "Black";
                    }
                }
            }, primitive_array);
        }
    });

	window.addEventListener("keydown",function(event){
		switch(true)
		{
			case event.key == "r":
                shape = "r";
                break;

            case event.key == "s":
                shape = "s";
                break;

			case event.key == "ArrowUp" && mode == 1:
                primitive_array[recentidx].coordinates[1] += 0.05;
				break;

			case event.key == "ArrowDown" && mode == 1:
                primitive_array[recentidx].coordinates[1] -= 0.05;
				break;

			case event.key == "ArrowLeft" && mode == 1:
                primitive_array[recentidx].coordinates[0] -= 0.05;
				break;

			case event.key == "ArrowRight" && mode == 1:
                primitive_array[recentidx].coordinates[0] += 0.05;
				break;

			case event.key == "+" && mode == 1:
                primitive_array[recentidx].size += 0.1;
				break;

			case event.key == "-" && mode == 1:
                primitive_array[recentidx].size -= 0.1;
				break;

			case event.key == "x" && mode == 1:
                primitive_array[recentidx].size = 0;
                primitive_array[recentidx].isDeleted = true;
                deleted.push(primitive_array[recentidx]);
                primitive_array.splice(recentidx,1);
				recentidx = -1;
				break;

			case event.key == "ArrowRight" && mode == 2:
				rotation +=10;
                primitive_array.forEach(p => {
                    let radians = rotation*Math.PI/180;
                    let sin = Math.sin(radians);
                    let cos = Math.cos(radians);
                    p.transform = [sin,cos];
                })
				break;

			case event.key == "ArrowLeft" && mode == 2:
				rotation +=350;
                primitive_array.forEach(p => {
                    let radians = rotation*Math.PI/180;
                    let sin = Math.sin(radians);
                    let cos = Math.cos(radians);
                    p.transform = [sin,cos];
                })
				break;

			case event.key == "m":
				mode = (mode+1)%3;
				if (mode == 0||mode ==2)
				{
					if(recentidx != -1)
					{
                        primitive_array[recentidx].color = "default";
					}
				}
				recentidx = -1;
                if(mode == 0)
                {
                    primitive_array.forEach(p => {
                        p.transform = [0,1];
                        p.origin = [0,0];
                    })
                }

                if(mode == 2)
                {
                	rotation = 0;
                	let xmin = Infinity;
                    let xmax = -Infinity;
                    let ymin = Infinity;
                    let ymax = -Infinity;

                    primitive_array.forEach(s => {
                        if (s.isDeleted == false) 
                        {
                            let array = Array.from(s.vertexAttributesData);
                            let x_array = [array[0], array[3], array[6], array[9]];
                            let y_array = [array[1], array[4], array[7], array[10]];
                            xmin = Math.min(xmin, Math.min(...x_array));
                            xmax = Math.max(xmax, Math.max(...x_array));
                            ymin = Math.min(ymin, Math.min(...y_array));
                            ymax = Math.max(ymax, Math.max(...y_array));
                        }
                    });
                    let box_bound = [(xmin + xmax) / 2, (ymin + ymax) / 2];
                    primitive_array.forEach(x => { x.origin = box_bound; });
                }
                break; 
            case event.key == "Escape":
                renderer.destroy();
                break;
		}
	});

    function animate() 
    {
        renderer.clear();
        primitive_array.forEach(s => {
            s.draw(shader);
        });
        window.requestAnimationFrame(animate);
    }

    animate();
    shader.delete();

}