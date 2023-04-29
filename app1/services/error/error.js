function exceptionFieldNullOrUndefined(args, error){
  if(args===null || args===undefined) throw error
}

function exceptionFieldIsEqualZero(args, error){
  
  if(args===0) throw error
}

function exceptionFieldIsEmpty(args, error){
  if(args==='') throw error
}

function exceptionFieldValueLessToType(args, error){
  if(args.length < 4) throw error
}

function exceptionFieldValueLongToType(args, error){
  if(args.length > 8) throw error
}

export { 
  exceptionFieldNullOrUndefined,
  exceptionFieldIsEqualZero,
  exceptionFieldIsEmpty,
  exceptionFieldValueLessToType,
  exceptionFieldValueLongToType
}