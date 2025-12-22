import pandas as pd
import json

FILES = {
    'crops': 'calculadora - SemillaPlaca.csv',
    'plates': 'calculadora - TipoPlaca.csv',
    'spacings': 'calculadora - DistanciaLineas.csv',
    'populations': 'calculadora - PoblacionSemHa.csv',
    'speeds': 'calculadora - VelocidadKmH.csv'
}

def run():
    print("🚀 Iniciando procesamiento de 8.806 registros...")
    try:
        # 1. Cargar y Normalizar columnas
        # Crops: ['SemillaPlacaID', 'SemillaPlaca'] -> ['id', 'name']
        df_crops = pd.read_csv(FILES['crops'], encoding='utf-8-sig').rename(
            columns={'SemillaPlacaID': 'id', 'SemillaPlaca': 'name'})
        
        # Plates: ['TipoPlacaID', 'SemillaPlacaID', 'TipoPlaca'] -> ['id', 'crop_id', 'name']
        df_plates = pd.read_csv(FILES['plates'], encoding='utf-8-sig').rename(
            columns={'TipoPlacaID': 'id', 'SemillaPlacaID': 'crop_id', 'TipoPlaca': 'name'})
        
        # Estos ya vienen con nombres correctos (id, crop_id, plate_id, name...)
        df_spacings = pd.read_csv(FILES['spacings'], encoding='utf-8-sig')
        df_pop = pd.read_csv(FILES['populations'], encoding='utf-8-sig')
        df_speed = pd.read_csv(FILES['speeds'], encoding='utf-8-sig')

        # 2. Limpiar velocidades (ej: "5,5 km/h" -> 5.5)
        def clean_v(val):
            s = str(val).lower().replace('km/h','').replace(' ','').replace(',','.')
            try: return float(s)
            except: return 0.0
        
        df_speed['v_num'] = df_speed['speed_value'].apply(clean_v)
        
        # 3. Filtrar solo los 'Si' y agrupar para sacar Min y Max por combinación
        valid = df_speed[df_speed['result'].str.strip().str.lower() == 'si']
        limits_grouped = valid.groupby(['crop_id', 'plate_id', 'spacing_id', 'population_id'])['v_num'].agg(['min', 'max']).reset_index()
        
        # 4. Crear estructura JSON para la App
        data = {
            'crops': df_crops[['id', 'name']].to_dict(orient='records'),
            'plates': df_plates[['id', 'crop_id', 'name']].to_dict(orient='records'),
            'spacings': df_spacings[['id', 'crop_id', 'plate_id', 'name']].to_dict(orient='records'),
            'populations': df_pop[['id', 'crop_id', 'plate_id', 'spacing_id', 'name']].to_dict(orient='records'),
            'limits': []
        }

        for _, row in limits_grouped.iterrows():
            # ID compuesto: crop|plate|spacing|population
            key = f"{row['crop_id']}|{row['plate_id']}|{row['spacing_id']}|{row['population_id']}"
            data['limits'].append({
                'id': key,
                'min_speed': row['min'],
                'max_speed': row['max']
            })

        # 5. Guardar JSON final (minificado para ahorrar espacio en la app)
        with open('seedData.json', 'w', encoding='utf-8') as f:
            json.dump(data, f, separators=(',', ':'), ensure_ascii=False)
        
        print(f"✅ 'seedData.json' generado con éxito.")
        print(f"📊 Resumen:")
        print(f"   - Cultivos: {len(data['crops'])}")
        print(f"   - Poblaciones Totales: {len(data['populations'])}")
        print(f"   - Combinaciones con Velocidad Óptima: {len(data['limits'])}")

    except Exception as e:
        print(f"❌ Error durante la conversión: {e}")

if __name__ == '__main__':
    run()