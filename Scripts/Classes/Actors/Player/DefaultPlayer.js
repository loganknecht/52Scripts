#pragma strict

class DefaultPlayer extends Actor {
	var upKey : String = "w";
	var downKey : String = "s";
	var leftKey : String = "a";
	var rightKey : String = "d";
	
	var jumpKey : String = "space";
	
	function Update () {
		playerEventHandling();
	}
	
	function FixedUpdate() {
		var movementVector : Vector3 = getMovementVector();
		movementVector = detectCollisions(movementVector);
		transform.Translate(movementVector);
	
		transform.position.z = 0;
	}	

	function detectCollisions(movementVector : Vector3) : Vector3 {		
		// normal rays
		var rightRay : RaycastHit;
		var leftRay : RaycastHit;
		var topRay : RaycastHit;
		var bottomRay : RaycastHit;
		
		// corner rays
		var topLeftRay : RaycastHit;
		var topRightRay : RaycastHit;
		var bottomLeftRay : RaycastHit;
		var bottomRightRay : RaycastHit;
		
		// vectors used to represent raycast shoot points
		var topLeftPosition : Vector3;
		var topRightPosition : Vector3;
		var bottomLeftPosition : Vector3;
		var bottomRightPosition : Vector3;
		
		var rayLength : int = 20;
		
		/*
		This is a mask created by using (1<<9) to create a bit mask that JUST performs collision
		checks on the specified layer 9. Then I complemented it with the '~' symbol in order
		to get a bitmask that performs collision checks on ALL layers EXCEPT the layer 9
		
		kk good talk 
		*/
		var ignoreMask : int = ~(1<<9);
		
		//-------------------------------------------------------
		// ALL COLLISION INTERACTION STARTS BELOW THIS LINE
		//-------------------------------------------------------
		/*
		*/
		
		//IMPORTANT: Do not remove this, it is used in order to help resolve issues with rotation and collision detection for the boxes
		transform.rotation = Quaternion.identity;
		
		//moving left
		if(movementVector.x <= 0) {
			//top left
			topLeftPosition = new Vector3(transform.position.x, transform.position.y + collider.bounds.size.y/2, transform.position.z);
			bottomLeftPosition = new Vector3(transform.position.x, transform.position.y - collider.bounds.size.y/2, transform.position.z);
			if (Physics.Raycast(topLeftPosition, -Vector3.right, topLeftRay, rayLength, ignoreMask)) {
				if(topLeftRay.distance <= -(movementVector.x - collider.bounds.size.x/2)) {
					if(topLeftRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (topLeftRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) {
						movementVector = performCollisionResponse(movementVector, HitSide.Left, HitDirection.Left, CollisionResponseType.None, topLeftRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Left, HitDirection.Left, CollisionResponseType.Inert, topLeftRay);
					}
				}
			}
			//left
			//Debug.DrawRay(transform.position, -Vector3.right*movementVector.x, Color.white);
			if (Physics.Raycast(transform.position, -Vector3.right, leftRay, rayLength, ignoreMask)) {
				if(leftRay.distance <= -(movementVector.x - collider.bounds.size.x/2)) {
					if(leftRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (leftRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) {
						movementVector = performCollisionResponse(movementVector, HitSide.Left, HitDirection.Left, CollisionResponseType.None, leftRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Left, HitDirection.Left, CollisionResponseType.Inert, leftRay);
					}
				}
			}
		}
		
		//moving right
		if(movementVector.x >= 0) {
			//top right
			topRightPosition = new Vector3(transform.position.x, transform.position.y + collider.bounds.size.y/2, transform.position.z);
			bottomRightPosition = new Vector3(transform.position.x, transform.position.y - collider.bounds.size.y/2, transform.position.z);
			if (Physics.Raycast(topRightPosition, Vector3.right, topRightRay, rayLength, ignoreMask)) {
				if(topRightRay.distance <= (movementVector.x + collider.bounds.size.x/2)) {
					if(topRightRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (topRightRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) {
						movementVector = performCollisionResponse(movementVector, HitSide.Right, HitDirection.Right, CollisionResponseType.None, topRightRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Right, HitDirection.Right, CollisionResponseType.Inert, topRightRay);
					}
					
				}
			}
			//right
			if (Physics.Raycast(transform.position, Vector3.right, rightRay, rayLength, ignoreMask)) {
				if(rightRay.distance <= (movementVector.x + collider.bounds.size.x/2)) {
					if(rightRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (rightRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) {
						movementVector = performCollisionResponse(movementVector, HitSide.Right, HitDirection.Right, CollisionResponseType.None, rightRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Right, HitDirection.Right, CollisionResponseType.Inert, rightRay);
					}
				}
			}
		}
		
		//------------------------------------------------------------------------------------------------------------------
		
		//moving up
		if(movementVector.y >= 0) {
			topLeftPosition = new Vector3(transform.position.x - collider.bounds.size.x/2.5, transform.position.y, transform.position.z);
			topRightPosition = new Vector3(transform.position.x + collider.bounds.size.x/2.5, transform.position.y, transform.position.z);
			//top left
			if (Physics.Raycast(topLeftPosition, Vector3.up, topLeftRay, rayLength, ignoreMask)) {
				if(topLeftRay.distance <= (movementVector.y + collider.bounds.size.y/2)) {
					if(topLeftRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (topLeftRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.None, topLeftRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.Inert, topLeftRay);
					}
				}
			}
			//top
			//Debug.DrawRay(transform.position, Vector3.up*movementVector.y, Color.white);
			if (Physics.Raycast(transform.position, Vector3.up, topRay, rayLength, ignoreMask)) {
				if(topRay.distance <= (movementVector.y + collider.bounds.size.y/2)) {
					if(topRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (topRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.None, topRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.Inert, topRay);
					}
					
				}
			}
			//top right
			if (Physics.Raycast(topRightPosition, Vector3.up, topRightRay, rayLength, ignoreMask)) {
				if(topRightRay.distance <= (movementVector.y + collider.bounds.size.y/2)) {
					if(topRightRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (topRightRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.None, topRightRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Top, HitDirection.Above, CollisionResponseType.Inert, topRightRay);
					}
				}
			}
		}
		
		//moving down
		if(movementVector.y <= 0) {
			bottomLeftPosition = new Vector3(transform.position.x - collider.bounds.size.x/2.1, transform.position.y, transform.position.z);
			bottomRightPosition = new Vector3(transform.position.x + collider.bounds.size.x/2.1, transform.position.y, transform.position.z);
			
			//down
			if (Physics.Raycast(transform.position, -Vector3.up, bottomRay, rayLength, ignoreMask)) {
				if(bottomRay.distance <= -(movementVector.y - collider.bounds.size.y/2)) {
					if(bottomRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (bottomRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.None, bottomRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.Inert, bottomRay);
					}
				}
			}
			
			//left-down
			if (Physics.Raycast(bottomLeftPosition, -Vector3.up, bottomLeftRay, rayLength, ignoreMask)) {
				if(bottomLeftRay.distance <= -(movementVector.y - collider.bounds.size.y/2)) {
					if(bottomLeftRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (bottomLeftRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.None, bottomLeftRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.Inert, bottomLeftRay);
					}					
				}
			}
			//left-mid-down
			var bottomMidLeftPosition = new Vector3(transform.position.x - collider.bounds.size.x/4, transform.position.y, transform.position.z);
			if (Physics.Raycast(bottomMidLeftPosition, -Vector3.up, bottomLeftRay, rayLength, ignoreMask)) {
				if(bottomLeftRay.distance <= -(movementVector.y - collider.bounds.size.y/2)) {		
					if(bottomLeftRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (bottomLeftRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.None, bottomLeftRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.Inert, bottomLeftRay);
					}
				}
			}
			//right-down
			if (Physics.Raycast(bottomRightPosition, -Vector3.up, bottomRightRay, rayLength, ignoreMask)) {
				if(bottomRightRay.distance <= -(movementVector.y - collider.bounds.size.y/2)) {				
					if(bottomRightRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (bottomRightRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.None, bottomRightRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.Inert, bottomRightRay);
					}
				}
			}
			//right-mid-down
			var bottomMidRightPosition = new Vector3(transform.position.x + collider.bounds.size.x/4, transform.position.y, transform.position.z);
			if (Physics.Raycast(bottomMidRightPosition, -Vector3.up, bottomRightRay, rayLength, ignoreMask)) {
				if(bottomRightRay.distance <= -(movementVector.y - collider.bounds.size.y/2)) {
					if(bottomRightRay.collider.gameObject.GetComponent(DefaultGameObject) != null
						&& (bottomRightRay.collider.gameObject.GetComponent(DefaultGameObject).notCollidable
						|| notCollidable)) { 
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.None, bottomRightRay);
					}
					else {
						movementVector = performCollisionResponse(movementVector, HitSide.Bottom, HitDirection.Below, CollisionResponseType.Inert, bottomRightRay);
					}
				}
			}
		}
	
		//---------------------------------------------------------------------------------------------------------------
		//IMPORTANT
		//This handles the actor rotation and helps make it so that the actor is consistent on most platform orientations
		
		//middle-down;
		//TODO: CONSIDER ADDING TWO MORE DOWN RAYS THAT ARE REALLY CLOSE TO THE CENTER OF THE BOTTOM OF THE ACTOR
		//BUT NOT NECESSARILY THE CENTER, USE THESE TO REFINE THE COLLISIONS ACCORDINGLY SO THAT SLOPE INTERACTION
		//IS LESS... GLITCHY
		if (Physics.Raycast(transform.position, -Vector3.up, bottomRay)) {
			if(bottomRay.distance <= -(movementVector.y - collider.bounds.size.y/1.2)) {
				transform.rotation = Quaternion.Euler(new Vector3(0, 0, bottomRay.transform.rotation.eulerAngles.z));
			}
			if(!isJumping) {
				//fix actor rotation
				if(transform.rotation.eulerAngles.z >= 310 && transform.rotation.eulerAngles.z < 320) {
					movementVector.y -= 2;
				}
				else if(transform.rotation.eulerAngles.z >= 320 && transform.rotation.eulerAngles.z < 330) {
					movementVector.y -= 1.5;
				}
				else if(transform.rotation.eulerAngles.z >= 330 && transform.rotation.eulerAngles.z < 340) {
					movementVector.y -= 1;
				}
				else if(transform.rotation.eulerAngles.z >= 340 && transform.rotation.eulerAngles.z < 350) {
					movementVector.y -= .5;
				}
				else if(transform.rotation.eulerAngles.z >= 350 && transform.rotation.eulerAngles.z < 355) {
					movementVector.y -= .5;
				}
			}
		}
	
		//END ACTOR ROTATION CODE
		//---------------------------------------------------------------------------------------------------------------
		return movementVector;	
	}
	
	function performCollisionResponse(movementVector :Vector3, hitSide : HitSide, hitDirection : HitDirection, responseType : CollisionResponseType, raycastHit : RaycastHit) : Vector3 {	
		// this helps deterine how far to offset the interaction for collisions so that an object can be as flush as possible
		// if the value being compared to this is greater than it then the move value is allowed, otherwise it's zeroed out
		var moveThreshold : float = 8;
		
		if(raycastHit.collider.GetType() == BoxCollider) {
			//Do nothing, no collision response was specified to be used
			if(responseType == CollisionResponseType.None) {
			}
			//Perform the inert collision response, this means that the colliding object will not be able to move past what they're colliding with 
			else if(responseType == CollisionResponseType.Inert) {
				//Top
				if(hitSide == HitSide.Top) {
					if(hitDirection == HitDirection.Above) {
						if(raycastHit.distance <= (movementVector.y + collider.bounds.size.y/2)) {
							if(movementVector.y > moveThreshold) {
								movementVector.y = movementVector.y/2;
							}
							else {
								movementVector.y = raycastHit.distance - collider.bounds.size.y/2;
								
								//The player can no longer go up so they just fall
								if(isJumping) {
									isJumping = false;
									jumpUsed = true;
								}
							}
						}
					}
				}
				//Right
				if(hitSide == HitSide.Right) {
					if(hitDirection == HitDirection.Right) {
						if(raycastHit.distance <= (movementVector.x + collider.bounds.size.x/2)) {
							if(movementVector.x > moveThreshold) {
								movementVector.x = movementVector.x/2;
							}
							else {
								movementVector.x = raycastHit.distance - collider.bounds.size.x/2;
								
								/*
								Because the player can't move any further through the object
								it is now pushing the object
								This sets the animation to start accordingly
								*/
								if(!isPushing 
									&& !isStanding()
									&& !isJumping
									&& !jumpUsed) {
									isPushing = true;
									animatedImage.animateOver(97, 97, 100);
								}
							}
						}
					}
				}
				//Bottom
				if(hitSide == HitSide.Bottom) {
					if(hitDirection == HitDirection.Below) {						
						if(raycastHit.distance <= -(movementVector.y - collider.bounds.size.y/2)) {
							if(-movementVector.y > moveThreshold) {
								movementVector.y = movementVector.y/2;
							}
							else {
								movementVector.y = -(raycastHit.distance - collider.bounds.size.y/2);
								
								if(jumpUsed || isJumping) {
									resetJump();
									if(movingRight || movingLeft) {
										animatedImage.animateOver(19, 19, 28);
									}
									else {
										animatedImage.animateOver(0, 0, 4);
									}
								}
							}
						}
					}
				}
				//Left
				if(hitSide == HitSide.Left) {
					if(hitDirection == HitDirection.Left) {
						if(raycastHit.distance <= -(movementVector.x - collider.bounds.size.x/2)) {
							if(-movementVector.x > moveThreshold) {
								movementVector.x = movementVector.x/2;
							}
							else {
								movementVector.x = -raycastHit.distance + collider.bounds.size.x/2;
								
																/*
								Because the player can't move any further through the object
								it is now pushing the object
								This sets the animation to start accordingly
								*/
								if(!isPushing 
									&& !isStanding()
									&& !isJumping
									&& !jumpUsed) {
									isPushing = true;
									animatedImage.animateOver(97, 97, 100);
								}
							}
						}
					}
				}
			}
		}
		
		return movementVector;
	}
	
/*--------------------------------------------------------------------------------------------------------------------------
End of the collision functions
--------------------------------------------------------------------------------------------------------------------------*/

	function playerEventHandling() {
		//------left-------
		//if left key pressed and right key not held
		if(Input.GetKeyDown(leftKey)) {
			movingLeft = true;
			movingRight = false;
			
			if(!animatedImage.flipImage) {
				animatedImage.setFlipImage(true);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//if left key pressed and right key held
		if(Input.GetKeyDown(leftKey) && Input.GetKey(rightKey)) {
			movingLeft = true;
			movingRight = false;
			isPushing = false;
			
			if(!animatedImage.flipImage) {
				animatedImage.setFlipImage(true);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//if left key held and right key released
		if(Input.GetKey(leftKey) && Input.GetKeyUp(rightKey)) {
			movingLeft = true;
			movingRight = false;
			
			if(!animatedImage.flipImage) {
				animatedImage.setFlipImage(true);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//if left key released
		if(Input.GetKeyUp(leftKey)) {
			movingLeft = false;
			isPushing = false;
			
			if(isStanding()) { 
				animatedImage.animateOver(0, 0, 4);
			}
		}	
		//----------------------
		
		//------right-------
		//right key pressed, left key not held
		if(Input.GetKeyDown(rightKey) && !Input.GetKey(leftKey)) {
			movingRight = true;
			movingLeft =false;
			
			if(animatedImage.flipImage) {
				animatedImage.setFlipImage(false);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//right key press, left key held
		if(Input.GetKeyDown(rightKey) && Input.GetKey(leftKey)) {
			movingRight = true;
			movingLeft = false;
			isPushing = false;
		
			if(animatedImage.flipImage) {
				animatedImage.setFlipImage(false);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//right key held, left key released
		if(Input.GetKey(rightKey) && Input.GetKeyUp(leftKey)) {
			movingRight = true;
			movingLeft = false;
			
			if(animatedImage.flipImage) {
				animatedImage.setFlipImage(false);
			}
			if(!(isJumping || jumpUsed)) {
				animatedImage.animateOver(19, 19, 28);
			}
		}
		//if right key released
		if(Input.GetKeyUp(rightKey)) {
			movingRight = false;
			isPushing = false; 
			
			if(isStanding()) { 
				animatedImage.animateOver(0, 0, 4); 
			}
		}
		//----------------------
		
		//------ up key -------
		//up key pressed
		if(Input.GetKeyDown(upKey)) {
			pressingUp = true;
		}
		//if up key released
		if(Input.GetKeyUp(upKey)) {
			pressingUp = false;
		}
		//----------------------
		
		//------ down key -------
		//up key pressed
		if(Input.GetKeyDown(downKey)) {
			pressingDown = true;
		}
		//if up key released
		if(Input.GetKeyUp(downKey)) {
			pressingDown = false;
		}
		//----------------------
		
		//------jumping-------
		if(Input.GetKeyDown(jumpKey)) {
			// fixes rotation when on hills... and stuff
			transform.rotation = Quaternion.identity;
	
			//-----
			if(!jumpUsed) {
				isJumping = true;
				jumpTimer = 0;
				animatedImage.animateOnceAndStopAtEnd(37, 37, 39);
				isPushing = false;
			}
		}
		if(Input.GetKeyUp(jumpKey)) {
			if(isJumping) {
				isJumping = false;
				jumpUsed = true;
				animatedImage.animateOnceAndStopAtEnd(39, 39, 41);
			}
		}
		//----------------------
	}

	override function getMovementVector() : Vector3 {
		var moveDirection = Vector3(0, 0, 0);
		
		if(isJumping && !jumpUsed) {
			moveDirection.y += jumpSpeed;
			
			if(jumpTimer < jumpTimerMax) {
				jumpTimer++;
			}
			else {
				isJumping = false;
				jumpUsed = true;
				animatedImage.animateOnceAndStopAtEnd(39, 39, 41);
			}
		}
		
		if((movingLeft || movingRight) && !(movingLeft && movingRight)) {
			if(movingLeft) {
				moveDirection.x -= moveSpeed;
			}
			if(movingRight) {
				moveDirection.x += moveSpeed;
			}
		}
		
		//applies gravity
		if(!isJumping) {
			moveDirection.y -= fallSpeed;
		}
		return moveDirection;
	}

	function resetJump() {
		jumpTimer = 0;
		isJumping = false;
		jumpUsed = false;
	}
}