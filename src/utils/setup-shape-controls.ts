import { fabric } from 'fabric'

type ControlOptions = Partial<fabric.Control>

function setupShapeControls(canvas: fabric.Canvas, polygon: fabric.Polygon) {
  // define a function that can locate the controls.
  // this function will be used both for drawing and for interaction.
  const polygonPositionHandler: ControlOptions['positionHandler'] = function (
    _dim,
    _finalMatrix,
    fabricObject: fabric.Polygon
  ) {
    const x =
      // @ts-ignore
      fabricObject.points![this.pointIndex].x - fabricObject.pathOffset.x
    const y =
      // @ts-ignore
      fabricObject.points![this.pointIndex].y - fabricObject.pathOffset.y

    const point = fabric.util.transformPoint(
      new fabric.Point(x, y),
      fabric.util.multiplyTransformMatrices(
        canvas.viewportTransform!,
        fabricObject.calcTransformMatrix()
      )
    )

    return point
  }
  function getObjectSizeWithStroke(object: fabric.Object) {
    const stroke = new fabric.Point(
      object.strokeUniform ? 1 / object.scaleX! : 1,
      object.strokeUniform ? 1 / object.scaleY! : 1
    ).multiply(object.strokeWidth!)
    return new fabric.Point(object.width! + stroke.x, object.height! + stroke.y)
  }

  // define a function that will define what the control does
  // this function will be called on every mouse move after a control has been
  // clicked and is being dragged.
  // The function receive as argument the mouse event, the current trasnform object
  // and the current position in canvas coordinate
  // transform.target is a reference to the current object being transformed,
  const actionHandler: ControlOptions['actionHandler'] = function (
    _eventData,
    transform,
    x,
    y
  ) {
    const polygon = transform.target as fabric.Polygon
    // @ts-ignore
    const currentControl = polygon.controls[polygon.__corner]
    // @ts-ignore
    if (!currentControl) return false
    const mouseLocalPosition = polygon.toLocalPoint(
      new fabric.Point(x, y),
      'center',
      'center'
    )
    const polygonBaseSize = getObjectSizeWithStroke(polygon)
    const size = polygon._getTransformedDimensions(0, 0)
    const finalPointPosition = {
      x:
        (mouseLocalPosition.x * polygonBaseSize.x) / size.x +
        polygon.pathOffset.x,
      y:
        (mouseLocalPosition.y * polygonBaseSize.y) / size.y +
        polygon.pathOffset.y,
    }
    // @ts-ignore
    polygon.points![currentControl.pointIndex] = finalPointPosition

    // @ts-ignore
    polygon._setPositionDimensions({})

    return true
  }

  // define a function that can keep the polygon in the same position when we change its
  // width/height/top/left.
  const anchorWrapper = function (anchorIndex: any, fn: any) {
    return function (eventData: any, transform: any, x: any, y: any) {
      const fabricObject = transform.target,
        absolutePoint = fabric.util.transformPoint(
          new fabric.Point(
            fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x,
            fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y
          ),

          fabricObject.calcTransformMatrix()
        ),
        actionPerformed = fn(eventData, transform, x, y),
        polygonBaseSize = getObjectSizeWithStroke(fabricObject),
        newX =
          (fabricObject.points[anchorIndex].x - fabricObject.pathOffset.x) /
          polygonBaseSize.x,
        newY =
          (fabricObject.points[anchorIndex].y - fabricObject.pathOffset.y) /
          polygonBaseSize.y
      fabricObject.setPositionByOrigin(absolutePoint, newX + 0.5, newY + 0.5)
      return actionPerformed
    }
  }

  const lastControl = polygon.points!.length - 1

  polygon.controls = polygon.points!.reduce(function (acc: any, point, index) {
    acc['p' + index] = new fabric.Control({
      positionHandler: polygonPositionHandler,
      actionHandler: anchorWrapper(
        index > 0 ? index - 1 : lastControl,
        actionHandler
      ),
      actionName: 'modifyPolygon',
      // @ts-ignore
      pointIndex: index,
    })
    return acc
  }, {})
}

export { setupShapeControls }
