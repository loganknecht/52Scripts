#pragma strict
class DefaultGameObject extends BaseGameObject {
	//----------------------------------
	//Animated Image variables here
	//----------------------------------
	var animatedImage : AnimatedImage;
	
	var framesPerSecond : float = 12;
	
	var spriteTexture : Material;
	
	var defaultSpriteXRotation : int = 0;
	var defaultSpriteYRotation : int = 0;
	var defaultSpriteZRotation : int = 0;
	
	var spriteSheetColumnSize : int = 1;
	var spriteSheetRowSize : int = 1;
	
	var spriteSheetInitialCurrentFrame : int = 0;
	var spriteSheetInitialStartFrame : int = 0;
	var spriteSheetInitialEndFrame : int = 0;
	
	var initiallyFlipImage : boolean = false;
	
	//----------------------------------
	//Moving variables here
	//----------------------------------
	var movingLeft = false;
	var movingRight = false;
	
	var pressingUp = false;
	var pressingDown = false;

	//jumping bs goes here
	var isJumping : boolean = false;
	var jumpUsed : boolean = false;
	var jumpTimerMax : int = 15;
	var jumpTimer : int = 0;
	
	var isPushing : boolean = false;
	
	//speed variables
	var moveSpeed : float = 2;
	var jumpSpeed : float = 3;
	var fallSpeed : float = 0;
	
	var movementModifier : Vector3 = Vector3.zero;
	var movementModifierDecrementSize : float = 0.5;
	
	//----------------------------------
	//Collider variables go here
	//----------------------------------
	var notCollidable : boolean = false;
	var useBoxCollider : boolean = false;
	var defaultBoxColliderXScale : int = 1;
	var defaultBoxColliderYScale : int = 1;
	var defaultBoxColliderZScale : int = 1;
	var useSphereCollider : boolean = false;
	var defaultSphereColliderRadius : int = 1;
/*--------------------------------------------------------------------------------------------------------------------------
Initialization functions go below here
--------------------------------------------------------------------------------------------------------------------------*/	
	function Start () {
		performInitialization();
	}
	
	/*
	Wrapper function to perform the default set up
	*/
	function performInitialization() {
		addAndConfigureSprite();
		addAndConfigureCollider();
	}
	
	/*
	Adds and configures the default animated image that gets attached to the object
	*/
	function addAndConfigureSprite() {
		//This adds the animated image component to the actor
		this.gameObject.AddComponent(AnimatedImage);
		
		//sets the animated image reference to the newly added script
		animatedImage = this.GetComponent(AnimatedImage);
		
		//This sets the sprite texture so it doesn't get skipped over
		animatedImage.spriteTexture = spriteTexture;
		animatedImage.columnSize = spriteSheetColumnSize;
		animatedImage.rowSize = spriteSheetRowSize;
		
		animatedImage.framesPerSecond = framesPerSecond;
		
		//These are rotations that are set to help the default rotation of the image
		animatedImage.defaultXRotation = defaultSpriteXRotation;
		animatedImage.defaultYRotation = defaultSpriteYRotation;
		animatedImage.defaultZRotation = defaultSpriteZRotation;
		
		//This sets the initial current, start, and end frame of the animation object
		animatedImage.currentFrame = spriteSheetInitialCurrentFrame;
		animatedImage.startFrame = spriteSheetInitialStartFrame;
		animatedImage.endFrame = spriteSheetInitialEndFrame;
		
		//This sets the image to be flipped if it has to be initially
		animatedImage.flipImage = initiallyFlipImage;
	}
	
	/*
	Adds and sets the default values for the collider that is desired to be used
	*/
	function addAndConfigureCollider() {
		//If the sphere collider and box collider are both selected to be used
		//it defaults to box collider, this is also the case if they're both false
		if(useBoxCollider && useSphereCollider) {
			this.gameObject.AddComponent("BoxCollider");
			(this.collider as BoxCollider).size = new Vector3(defaultBoxColliderXScale, defaultBoxColliderYScale, defaultBoxColliderZScale);
		}
		else if(!useBoxCollider && !useSphereCollider) {
			this.gameObject.AddComponent("BoxCollider");
			(this.collider as BoxCollider).size = new Vector3(defaultBoxColliderXScale, defaultBoxColliderYScale, defaultBoxColliderZScale);
		}
		else if(useBoxCollider && !useSphereCollider) {
			this.gameObject.AddComponent("BoxCollider");
			(this.collider as BoxCollider).size = new Vector3(defaultBoxColliderXScale, defaultBoxColliderYScale, defaultBoxColliderZScale);
		}
		else if(!useBoxCollider && useSphereCollider) {
			this.gameObject.AddComponent("SphereCollider");
			(this.collider as SphereCollider).radius = defaultSphereColliderRadius;
		}
	}
/*--------------------------------------------------------------------------------------------------------------------------
End of initialization functions
--------------------------------------------------------------------------------------------------------------------------*/


/*--------------------------------------------------------------------------------------------------------------------------
Start of the Update/FixedUpdate functions
--------------------------------------------------------------------------------------------------------------------------*/
	function Update () {
	}
	
	function FixedUpdate() {
		var movementVector : Vector3 = getMovementVector();
		movementVector = detectCollisions(movementVector);
		transform.Translate(movementVector);
	
		transform.position.z = 0;
	}
/*--------------------------------------------------------------------------------------------------------------------------
End of the Update/FixedUpdate functions
--------------------------------------------------------------------------------------------------------------------------*/
	

/*--------------------------------------------------------------------------------------------------------------------------
Start of the collision functions
--------------------------------------------------------------------------------------------------------------------------*/			
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
									//animatedImage.animateOver(97, 97, 100);
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
										//animatedImage.animateOver(19, 19, 28);
									}
									else {
										//animatedImage.animateOver(0, 0, 4);
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
									//animatedImage.animateOver(97, 97, 100);
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

	function getMovementVector() : Vector3 {
		var moveDirection = Vector3(0, 0, 0);
	
		if(isJumping && !jumpUsed) {
			
			//TODO: If double jump is added modify this line
			//so that the speed can be changed if you want that
			moveDirection.y += jumpSpeed;
			
			if(jumpTimer < jumpTimerMax) {
				jumpTimer++;
			}
			else {
				isJumping = false;
				jumpUsed = true;
				//animatedImage.animateOnceAndStopAtEnd(39, 39, 41);
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
	
	function isStanding() {
		if(!movingLeft && !movingRight && !isJumping && !jumpUsed) {
			return true;
		}
		else {
			return false;
		}
	}
}