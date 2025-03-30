import { SketchPicker } from 'react-color';
import { useState } from 'react';

const ProductForm = ({ initialData, onSubmit, isEditing }) => {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState(initialData?.stoneColor || '#ffffff');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
        {/* ... existing form fields ... */}
        
        {/* Stone Details Section */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Stone Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="stone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone</FormLabel>
                  <FormControl>
                    <Input placeholder="Stone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="totalWeight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Weight (CT. T.W.)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="Total Weight" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stoneColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone Color</FormLabel>
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-9 h-9 rounded-md border cursor-pointer" 
                      style={{ backgroundColor: field.value || '#ffffff' }}
                      onClick={() => setShowColorPicker(!showColorPicker)}
                    />
                    <FormControl>
                      <Input placeholder="Color" {...field} />
                    </FormControl>
                  </div>
                  {showColorPicker && (
                    <div className="absolute z-10 mt-2">
                      <div 
                        className="fixed inset-0" 
                        onClick={() => setShowColorPicker(false)}
                      />
                      <SketchPicker 
                        color={field.value || '#ffffff'} 
                        onChange={(color) => field.onChange(color.hex)}
                      />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="clarity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Clarity</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select clarity" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="FL">FL (Flawless)</SelectItem>
                      <SelectItem value="IF">IF (Internally Flawless)</SelectItem>
                      <SelectItem value="VVS1">VVS1</SelectItem>
                      <SelectItem value="VVS2">VVS2</SelectItem>
                      <SelectItem value="VS1">VS1</SelectItem>
                      <SelectItem value="VS2">VS2</SelectItem>
                      <SelectItem value="SI1">SI1</SelectItem>
                      <SelectItem value="SI2">SI2</SelectItem>
                      <SelectItem value="I1">I1</SelectItem>
                      <SelectItem value="I2">I2</SelectItem>
                      <SelectItem value="I3">I3</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lifetimeCommitment"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Lifetime Diamond Commitment</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stoneType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select stone type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Diamond">Diamond</SelectItem>
                      <SelectItem value="Ruby">Ruby</SelectItem>
                      <SelectItem value="Emerald">Emerald</SelectItem>
                      <SelectItem value="Sapphire">Sapphire</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stoneShape"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone Shape</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select shape" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Round">Round</SelectItem>
                      <SelectItem value="Princess">Princess</SelectItem>
                      <SelectItem value="Cushion">Cushion</SelectItem>
                      <SelectItem value="Oval">Oval</SelectItem>
                      <SelectItem value="Marquise">Marquise</SelectItem>
                      <SelectItem value="Pear">Pear</SelectItem>
                      <SelectItem value="Emerald">Emerald</SelectItem>
                      <SelectItem value="Heart">Heart</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="caratRange"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carat Range</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carat range" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Under 1 Ctw">Under 1 Ctw</SelectItem>
                      <SelectItem value="1 Ctw - Under 3 Ctw">1 Ctw - Under 3 Ctw</SelectItem>
                      <SelectItem value="3 Ctw - Under 5 Ctw">3 Ctw - Under 5 Ctw</SelectItem>
                      <SelectItem value="5 Ctw and Up">5 Ctw and Up</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stoneClass"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone Class</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Natural">Natural</SelectItem>
                      <SelectItem value="Lab-Grown">Lab-Grown</SelectItem>
                      <SelectItem value="Synthetic">Synthetic</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="stoneSetting"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stone Setting</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select setting" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Prong">Prong</SelectItem>
                      <SelectItem value="Channel">Channel</SelectItem>
                      <SelectItem value="Pavé">Pavé</SelectItem>
                      <SelectItem value="Bezel">Bezel</SelectItem>
                      <SelectItem value="Tension">Tension</SelectItem>
                      <SelectItem value="Bar">Bar</SelectItem>
                      <SelectItem value="Flush">Flush</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="settingOnly"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox 
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Setting Only</FormLabel>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Metal Details Section */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Metal Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="metalType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metal Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metal type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Gold">Gold</SelectItem>
                      <SelectItem value="Silver">Silver</SelectItem>
                      <SelectItem value="Platinum">Platinum</SelectItem>
                      <SelectItem value="Titanium">Titanium</SelectItem>
                      <SelectItem value="Stainless Steel">Stainless Steel</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="metalColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metal Color</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metal color" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Yellow">Yellow</SelectItem>
                      <SelectItem value="White">White</SelectItem>
                      <SelectItem value="Rose">Rose</SelectItem>
                      <SelectItem value="Two-Tone">Two-Tone</SelectItem>
                      <SelectItem value="Tri-Tone">Tri-Tone</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="metalFinish"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metal Finish</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select finish" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Polished">Polished</SelectItem>
                      <SelectItem value="Matte">Matte</SelectItem>
                      <SelectItem value="Brushed">Brushed</SelectItem>
                      <SelectItem value="Hammered">Hammered</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="goldKarat"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gold Karat</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select karat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="10K">10K</SelectItem>
                      <SelectItem value="14K">14K</SelectItem>
                      <SelectItem value="18K">18K</SelectItem>
                      <SelectItem value="22K">22K</SelectItem>
                      <SelectItem value="24K">24K</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* Ring Details Section */}
        <div className="border rounded-md p-4 mb-4">
          <h3 className="text-lg font-semibold mb-4">Ring Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="ringDesign"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ring Design</FormLabel>
                  <FormControl>
                    <Input placeholder="Ring Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="ringStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ring Style</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select style" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Wedding">Wedding</SelectItem>
                      <SelectItem value="Engagement">Engagement</SelectItem>
                      <SelectItem value="Fashion">Fashion</SelectItem>
                      <SelectItem value="Promise">Promise</SelectItem>
                      <SelectItem value="Anniversary">Anniversary</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="standardRingSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Standard Ring Size</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      placeholder="Ring Size" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value) || '')}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (mm)</FormLabel>
                  <FormControl>
                    <Input placeholder="Height" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        {/* ...existing form fields... */}
        
        <Button disabled={loading} className="ml-auto" type="submit">
          {action}
        </Button>
      </form>
    </Form>
  );
}; 