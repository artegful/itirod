export function ToggleFlexContainer (container, isEnabled) {
  ToggleContainerInternal(container, isEnabled, 'flex')
}

export function ToggleContainer (container, isEnabled) {
  ToggleContainerInternal(container, isEnabled, 'block')
}

export function ToggleElement (container, isEnabled) {
  ToggleContainerInternal(container, isEnabled, 'inline')
}

export function GetAbsolutePosition (element) {
  const rect = element.getBoundingClientRect()

  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY
  }
}

function ToggleContainerInternal (container, isEnabled, activeState) {
  container.style.display = isEnabled ? activeState : 'none'
}
