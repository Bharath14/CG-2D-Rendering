export default class Rectangle {
    constructor(gl, centerX, centerY, color = "default") 
    {
        this.coordinates = [centerX, centerY]
        this.color = color
        this.size=1
        this.origin = [0,0]
        this.transform=[0,1] //[sin(theta),cos(theta)]
        this.type = "Rectangle"
        this.isDeleted = false
        this.vertexAttributesData = new Float32Array([
            //  x , y,  z
            centerX + 0.05, centerY + 0.1, 0.0,    // Drawing a rectangle with length 0.1 unit and breadth 0.2 unit.
            centerX + 0.05, centerY - 0.1, 0.0,
            centerX - 0.05, centerY + 0.1, 0.0,
            centerX - 0.05, centerY - 0.1, 0.0,
        ]);
        this.vertexColors = new Uint8Array([
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
            ]);
        this.gl = gl;

        this.vertexAttributesBuffer = this.gl.createBuffer();
        this.colorBuffer = this.gl.createBuffer();
        if (!this.vertexAttributesBuffer) {
            throw new Error("Buffer for vertex attributes could not be allocated");
        }
        if (!this.colorBuffer) {
            throw new Error("Buffer for color attributes could not be allocated");
        }
    }
    draw(shader)
    {
    	let elementPerVertex = 3;
        if (this.size < 0.1 && this.isDeleted == false) 
        {
            this.size = 0.1;
        }
        this.vertexAttributesData = new Float32Array([
            //x,Y,Z
            
            this.coordinates[0] + 0.05 * (this.size), this.coordinates[1] + 0.1 * (this.size), 0.0,
            this.coordinates[0] + 0.05 * (this.size), this.coordinates[1] - 0.1 * (this.size), 0.0,
            this.coordinates[0] - 0.05 * (this.size), this.coordinates[1] + 0.1 * (this.size), 0.0,
            this.coordinates[0] - 0.05 * (this.size), this.coordinates[1] - 0.1 * (this.size), 0.0,
        ]);
        if (this.color == "default") 
        {
            this.vertexColors = new Uint8Array([
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
                1, 0, 0,
            ]);
        } 
        else 
        {
            this.vertexColors = new Uint8Array([
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
                0, 0, 0,
            ]);
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexAttributesBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexAttributesData, this.gl.DYNAMIC_DRAW);

        const aPosition = shader.attribute("aPosition");
        this.gl.enableVertexAttribArray(aPosition);
        this.gl.vertexAttribPointer(aPosition, elementPerVertex, this.gl.FLOAT, false, 0, 0);
       

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.colorBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertexColors, this.gl.STATIC_DRAW);

        const aColor = shader.attribute("aColor");
        this.gl.enableVertexAttribArray(aColor);
        this.gl.vertexAttribPointer(aColor, elementPerVertex, this.gl.UNSIGNED_BYTE, false, 0, 0);

        const rotation = shader.uniform("rotation");
        this.gl.uniform2fv(rotation, this.transform);

        const c = shader.uniform("origin");
        this.gl.uniform2fv(c, this.origin);

        this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, this.vertexAttributesData.length / (elementPerVertex));
    }
}

