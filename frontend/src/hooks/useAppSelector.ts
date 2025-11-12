import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux'
import type { AppDispatch, RootState } from '../store/store'

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export const useAppDispatch: () => AppDispatch = () => useDispatch<AppDispatch>()

