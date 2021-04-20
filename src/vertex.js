const vertexShaderSrc = `      
        attribute vec3 aPosition;  
        attribute vec3 aColor;  
        varying vec3 vColor; 
        uniform vec2 rotation; 
        uniform vec2 origin;
        void main () 
        {
          gl_Position = vec4(((aPosition.x-origin.x) * rotation.y + (aPosition.y-origin.y) * rotation.x) +origin.x,((aPosition.y-origin.y) * rotation.y - (aPosition.x-origin.x) * rotation.x)+origin.y,aPosition[2], 1.0); 
		      gl_PointSize = 5.0;     
		      vColor = aColor;
        }                          
	  `;

export default vertexShaderSrc;

// rotation variable contains [sin(theta),cos(theta)], where theta is angle of rotation.
// To find the position of a vertex when we implement rotation on an object so that origin remains same i.e rotation happens
// around the origin, we first make the origin of an object as centroid of the object and do rotation around that centroid and then move the new coordinates to old origin.
